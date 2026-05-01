import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { VoteDto } from '../dtos/vote.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { PollRepository } from '../repositories/poll.repository';
import { PollVoteRepository } from '../repositories/poll-vote.repository';
import { PollOptionRepository } from '../repositories/poll-option.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreatePollDto } from '../dtos/create-poll.dto';
import { PollSerializer } from '../serializers/poll.serializer';
import { RedisCacheService } from 'src/common/cache/services/redis-cache.service';
import { UpdatePollDto } from '../dtos/update-poll.dto';

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);

  constructor(
    private readonly pollRepo: PollRepository,
    private readonly pollVoteRepo: PollVoteRepository,
    private readonly pollOptionRepo: PollOptionRepository,
    private readonly redisCache: RedisCacheService,
  ) {}

  async getAll(userId: string) {
    const data = await this.pollRepo.getAll(userId);

    return ResponseHelper.response(
      PollSerializer,
      data,
      'Polls fetched successfully',
    );
  }

  async getPollById(userId: string, pollId: string) {
    const poll = await this.pollRepo.getDetailsById(pollId, userId);

    if (!poll) throw new GlobalHttpException('poll404', HttpStatus.NOT_FOUND);

    return ResponseHelper.response(
      PollSerializer,
      poll,
      'Poll fetched successfully',
    );
  }

  async create({ options, ...pollData }: CreatePollDto) {
    const poll = await this.pollRepo.create(pollData);

    if (options.length) {
      const optionsPromises = options.map((text) =>
        this.pollOptionRepo.create({
          pollId: poll._id.toString(),
          text,
        }),
      );

      const createdOptionsIds = (await Promise.all(optionsPromises)).map(
        (option) => option._id.toString(),
      );

      await this.pollRepo.updateOne(poll._id.toString(), {
        options: createdOptionsIds,
      });
    }

    return this.getPollById(poll._id.toString(), poll._id.toString());
  }

  async vote(userId: string, { pollId, optionId }: VoteDto) {
    const existingPoll = await this.pollRepo.findById(pollId);
    if (!existingPoll) {
      throw new GlobalHttpException('poll404', HttpStatus.NOT_FOUND);
    }

    const optionExists = await this.pollOptionRepo.findById(optionId);
    if (!optionExists) {
      throw new GlobalHttpException('pollOption404', HttpStatus.NOT_FOUND);
    }

    const voteExists = await this.pollVoteRepo.findOne(userId, {
      pollId,
      optionId,
    });
    await this.pollVoteRepo.delete(userId, { pollId });
    if (!voteExists) {
      await this.pollVoteRepo.create(userId, { pollId, optionId });
    }
  }

  async update(pollId: string, { options, ...pollData }: UpdatePollDto) {
    const existingPoll = await this.pollRepo.findById(pollId);
    if (!existingPoll) {
      throw new GlobalHttpException('poll404', HttpStatus.NOT_FOUND);
    }

    await this.pollRepo.updateOne(pollId, pollData);

    if (Array.isArray(options)) {
      await this.pollOptionRepo.deleteByPollId(pollId);
      await this.pollVoteRepo.deleteByPollId(pollId);

      const createdOptionsIds = (
        await Promise.all(
          options.map((text) =>
            this.pollOptionRepo.create({
              pollId,
              text,
            }),
          ),
        )
      ).map((option) => option._id.toString());

      await this.pollRepo.updateOne(pollId, {
        options: createdOptionsIds,
      });
    }

    return this.getPollById(existingPoll.createdBy?.toString() || pollId, pollId);
  }

  async delete(pollId: string) {
    const existingPoll = await this.pollRepo.findById(pollId);
    if (!existingPoll) {
      throw new GlobalHttpException('poll404', HttpStatus.NOT_FOUND);
    }

    await Promise.all([
      this.pollVoteRepo.deleteByPollId(pollId),
      this.pollOptionRepo.deleteByPollId(pollId),
      this.pollRepo.deleteById(pollId),
    ]);
  }

  async getAnalytics() {
    const [summary, analytics] = await Promise.all([
      this.pollVoteRepo.getAnalyticsSummary(),
      this.pollRepo.getAnalytics(),
    ]);

    const participationRate =
      summary.totalPolls > 0
        ? Number(((summary.totalVotes / summary.totalPolls) * 100).toFixed(2))
        : 0;

    return ResponseHelper.success({
      total_polls: summary.totalPolls,
      active_polls: summary.activePolls,
      total_votes: summary.totalVotes,
      participation_rate: participationRate,
      category_breakdown: analytics.categoryBreakdown.map((item) => ({
        category: item.category,
        count: item.count,
        percentage:
          summary.totalPolls > 0
            ? Number(((item.count / summary.totalPolls) * 100).toFixed(2))
            : 0,
      })),
      district_breakdown: analytics.districtBreakdown,
      politician_performance: analytics.politicianPerformance,
      party_performance: analytics.partyPerformance,
    });
  }

  async getCategories() {
    const cacheKey = 'polls:categories';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.success(cached);
    }

    const categories = await this.pollRepo.getCategories();
    await this.redisCache.set(cacheKey, categories);

    return ResponseHelper.success(categories);
  }

  async getStatuses() {
    const cacheKey = 'polls:statuses';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.success(cached);
    }

    const statuses = await this.pollRepo.getStatuses();
    await this.redisCache.set(cacheKey, statuses);
    return ResponseHelper.success(statuses);
  }

  async getTypes() {
    const cacheKey = 'polls:types';

    const cached = await this.redisCache.get(cacheKey);
    if (cached) {
      return ResponseHelper.success(cached);
    }

    const types = await this.pollRepo.getTypes();
    await this.redisCache.set(cacheKey, types);

    return ResponseHelper.success(types);
  }
}
