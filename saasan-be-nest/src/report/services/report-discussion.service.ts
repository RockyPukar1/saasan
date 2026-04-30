import { HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { AdminRepository } from 'src/user/repositories/admin.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { PoliticianRepository } from 'src/politics/politician/repositories/politician.repository';
import { ReportRepository } from '../repositories/report.repository';
import { ReportDiscussionCommentRepository } from '../repositories/report-discussion-comment.repository';
import { ReportDiscussionParticipantRepository } from '../repositories/report-discussion-participant.repository';
import { ReportDiscussionCommentVoteRepository } from '../repositories/report-discussion-comment-vote.repository';
import {
  ReportDiscussionAuthorRole,
  ReportDiscussionCommentEntityDocument,
} from '../entities/report-discussion-comment.entity';

type DiscussionActor = {
  role: string;
  userId: string;
  politicianId?: string;
};

@Injectable()
export class ReportDiscussionService {
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly commentRepo: ReportDiscussionCommentRepository,
    private readonly participantRepo: ReportDiscussionParticipantRepository,
    private readonly commentVoteRepo: ReportDiscussionCommentVoteRepository,
    private readonly userRepo: UserRepository,
    private readonly adminRepo: AdminRepository,
    private readonly politicianRepo: PoliticianRepository,
  ) {}

  async joinThread(reportId: string, actor: DiscussionActor) {
    await this.ensureDiscussionAvailable(reportId);
    await this.participantRepo.upsertJoin(reportId, actor.userId);
    return this.getThread(reportId, actor);
  }

  async getThread(reportId: string, actor: DiscussionActor) {
    const report = await this.ensureDiscussionAvailable(reportId);
    const [comments, participant, participantCount] = await Promise.all([
      this.commentRepo.findByReportId(reportId),
      this.participantRepo.findOne(reportId, actor.userId),
      this.participantRepo.countByReportId(reportId),
    ]);
    const commentVotes = await this.commentVoteRepo.findByUserAndCommentIds(
      actor.userId,
      comments.map((comment) => comment._id),
    );
    const voteMap = new Map(
      commentVotes.map((vote) => [vote.commentId.toString(), vote.direction]),
    );

    return {
      reportId,
      hasJoined: !!participant,
      participantCount,
      canCreateTopLevelComment: true,
      comments: this.buildTree(
        comments,
        actor,
        report.reporterId?.toString?.(),
        voteMap,
      ),
    };
  }

  async addTopLevelComment(
    reportId: string,
    content: string,
    actor: DiscussionActor,
  ) {
    const report = await this.ensureDiscussionAvailable(reportId);
    await this.participantRepo.upsertJoin(reportId, actor.userId, new Date());

    await this.commentRepo.create({
      reportId: new Types.ObjectId(reportId),
      authorId: new Types.ObjectId(actor.userId),
      authorRole: this.resolveAuthorRole(actor),
      authorDisplayName: await this.getActorDisplayName(actor),
      isReportOwner: report.reporterId?.toString?.() === actor.userId,
      content,
      depth: 0,
    });

    return this.getThread(reportId, actor);
  }

  async addReply(
    reportId: string,
    parentCommentId: string,
    content: string,
    actor: DiscussionActor,
  ) {
    const report = await this.ensureDiscussionAvailable(reportId);
    const parentComment = await this.commentRepo.findById(parentCommentId);

    if (!parentComment || parentComment.reportId.toString() !== reportId) {
      throw new GlobalHttpException('message404', HttpStatus.NOT_FOUND);
    }

    await this.assertReplyPermission(report, parentComment, actor);
    await this.participantRepo.upsertJoin(reportId, actor.userId, new Date());

    const threadRootCommentId =
      parentComment.threadRootCommentId || parentComment._id;

    await this.commentRepo.create({
      reportId: new Types.ObjectId(reportId),
      authorId: new Types.ObjectId(actor.userId),
      authorRole: this.resolveAuthorRole(actor),
      authorDisplayName: await this.getActorDisplayName(actor),
      isReportOwner: report.reporterId?.toString?.() === actor.userId,
      content,
      parentCommentId: new Types.ObjectId(parentCommentId),
      threadRootCommentId: new Types.ObjectId(threadRootCommentId),
      depth: (parentComment.depth || 0) + 1,
    });

    return this.getThread(reportId, actor);
  }

  async voteOnComment(
    reportId: string,
    commentId: string,
    direction: 'up' | 'down',
    actor: DiscussionActor,
  ) {
    await this.ensureDiscussionAvailable(reportId);
    const comment = await this.commentRepo.findById(commentId);

    if (!comment || comment.reportId.toString() !== reportId) {
      throw new GlobalHttpException('message404', HttpStatus.NOT_FOUND);
    }

    const existingVote = await this.commentVoteRepo.findOne(actor.userId, commentId);

    if (!existingVote) {
      await this.commentVoteRepo.create(actor.userId, commentId, direction);
      await this.commentRepo.adjustVoteCounts(commentId, {
        [direction === 'up' ? 'upvotesCount' : 'downvotesCount']: 1,
      });
    } else if (existingVote.direction === direction) {
      await this.commentVoteRepo.deleteById(existingVote._id);
      await this.commentRepo.adjustVoteCounts(commentId, {
        [direction === 'up' ? 'upvotesCount' : 'downvotesCount']: -1,
      });
    } else {
      await this.commentVoteRepo.updateDirection(existingVote._id, direction);
      await this.commentRepo.adjustVoteCounts(commentId, {
        [existingVote.direction === 'up' ? 'upvotesCount' : 'downvotesCount']:
          -1,
        [direction === 'up' ? 'upvotesCount' : 'downvotesCount']: 1,
      });
    }

    return this.getThread(reportId, actor);
  }

  private async ensureDiscussionAvailable(reportId: string) {
    const report = await this.reportRepo.findById({ reportId });

    if (!report) {
      throw new GlobalHttpException('report404', HttpStatus.NOT_FOUND);
    }

    if (!report.autoConvertedToMessage) {
      throw new GlobalHttpException('permission403', HttpStatus.FORBIDDEN);
    }

    return report;
  }

  private resolveAuthorRole(actor: DiscussionActor): ReportDiscussionAuthorRole {
    if (actor.role === 'admin') {
      return ReportDiscussionAuthorRole.ADMIN;
    }

    if (actor.role === 'politician') {
      return ReportDiscussionAuthorRole.POLITICIAN;
    }

    return ReportDiscussionAuthorRole.CITIZEN;
  }

  private async getActorDisplayName(actor: DiscussionActor) {
    if (actor.role === 'politician') {
      const politician = await this.politicianRepo.findOne({
        _id: new Types.ObjectId(actor.politicianId || actor.userId),
      });

      return politician?.fullName || 'Politician';
    }

    if (actor.role === 'admin') {
      const adminProfile = await this.adminRepo.findByUserId({ userId: actor.userId });
      if (adminProfile?.fullName) {
        return adminProfile.fullName;
      }
    }

    const user = await this.userRepo.findById({ userId: actor.userId });
    return user?.email?.split('@')[0] || 'Citizen';
  }

  private async assertReplyPermission(
    report: any,
    parentComment: ReportDiscussionCommentEntityDocument,
    actor: DiscussionActor,
  ) {
    const isReportOwner = report.reporterId?.toString?.() === actor.userId;
    const isPrivilegedActor =
      actor.role === 'admin' || actor.role === 'politician' || isReportOwner;

    if (isPrivilegedActor) {
      return;
    }

    const threadRootComment = parentComment.threadRootCommentId
      ? await this.commentRepo.findById(parentComment.threadRootCommentId)
      : parentComment;

    const parentIsPrivileged =
      parentComment.authorRole === ReportDiscussionAuthorRole.ADMIN ||
      parentComment.authorRole === ReportDiscussionAuthorRole.POLITICIAN ||
      parentComment.isReportOwner;

    const isOwnTopLevelThread =
      !!threadRootComment &&
      !threadRootComment.parentCommentId &&
      threadRootComment.authorId.toString() === actor.userId;

    if (!parentIsPrivileged || !isOwnTopLevelThread) {
      throw new GlobalHttpException('permission403', HttpStatus.FORBIDDEN);
    }
  }

  private buildTree(
    comments: ReportDiscussionCommentEntityDocument[],
    actor: DiscussionActor,
    reporterId?: string,
    voteMap?: Map<string, 'up' | 'down'>,
  ) {
    const commentsById = new Map<string, any>();
    const roots: any[] = [];

    for (const comment of comments) {
      const dto = {
        id: comment._id.toString(),
        content: comment.content,
        depth: comment.depth || 0,
        upvotesCount: comment.upvotesCount || 0,
        downvotesCount: comment.downvotesCount || 0,
        currentUserVote: voteMap?.get(comment._id.toString()) || null,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        parentCommentId: comment.parentCommentId?.toString?.() || null,
        threadRootCommentId: comment.threadRootCommentId?.toString?.() || null,
        author: {
          id: comment.authorId.toString(),
          role: comment.authorRole,
          displayName: comment.authorDisplayName,
          isReportOwner: comment.isReportOwner,
        },
        canReply: this.canReplyToComment(comment, comments, actor, reporterId),
        replies: [],
      };

      commentsById.set(dto.id, dto);
    }

    for (const comment of comments) {
      const dto = commentsById.get(comment._id.toString());
      const parentId = comment.parentCommentId?.toString?.();

      if (parentId && commentsById.has(parentId)) {
        commentsById.get(parentId).replies.push(dto);
      } else {
        roots.push(dto);
      }
    }

    return roots;
  }

  private canReplyToComment(
    comment: ReportDiscussionCommentEntityDocument,
    comments: ReportDiscussionCommentEntityDocument[],
    actor: DiscussionActor,
    reporterId?: string,
  ) {
    const isReportOwner = reporterId === actor.userId;
    if (actor.role === 'admin' || actor.role === 'politician' || isReportOwner) {
      return true;
    }

    const threadRootId =
      comment.threadRootCommentId?.toString?.() || comment._id.toString();
    const threadRootComment =
      comments.find((item) => item._id.toString() === threadRootId) || comment;

    const isOwnThreadRoot =
      !threadRootComment.parentCommentId &&
      threadRootComment.authorId.toString() === actor.userId;
    const targetIsPrivileged =
      comment.authorRole === ReportDiscussionAuthorRole.ADMIN ||
      comment.authorRole === ReportDiscussionAuthorRole.POLITICIAN ||
      comment.isReportOwner;

    return isOwnThreadRoot && targetIsPrivileged;
  }
}
