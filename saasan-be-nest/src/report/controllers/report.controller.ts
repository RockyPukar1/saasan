import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReportService } from '../services/report.service';
import { CreateReportDto } from '../dtos/create-report.dto';
import { type Request } from 'express';
import { HttpAccessTokenGuard } from 'src/common/guards/http-access-token.guard';
import { ReportIdDto } from '../dtos/report-id.dto';
import { ReportFilterDto } from '../dtos/report-filter.dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { PERMISSIONS } from 'src/common/constants/permission.constants';
import { ApproveReportDto } from '../dtos/approve-report.dto';
import { CreateReportDiscussionCommentDto } from '../dtos/create-report-discussion-comment.dto';
import { VoteReportDiscussionCommentDto } from '../dtos/vote-report-discussion-comment.dto';

@UseGuards(HttpAccessTokenGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async create(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10 MB
          new FileTypeValidator({
            fileType: /(jpeg|jpg|png|gif|pdf|doc|docx)$/,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Req() req: Request,
    @Body() reportData: CreateReportDto,
  ) {
    return await this.reportService.create(
      {
        ...reportData,
        reporterId: req.user.id,
      },
      files,
    );
  }

  @Post('filter')
  async getAll(@Body() reportFilterDto: ReportFilterDto, @Req() req: Request) {
    return await this.reportService.getAll(reportFilterDto, req.user.id);
  }

  @Get('my-reports')
  async getMyReports(@Req() req: Request) {
    return await this.reportService.getMyReports(req.user.id);
  }

  @Get(':reportId')
  async getById(@Param() param: ReportIdDto, @Req() req: Request) {
    return await this.reportService.getById(param, req.user.id);
  }

  @Put(':reportId')
  async updateReport(
    @Param() param: ReportIdDto,
    @Req() req: Request,
    @Body() updateData: Partial<CreateReportDto>,
  ) {
    return await this.reportService.updateOwnReport(
      param,
      req.user.id,
      updateData,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':reportId')
  async deleteById(@Param() param: ReportIdDto) {
    await this.reportService.deleteById(param);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':reportId/vote')
  async vote(
    @Param() param: ReportIdDto,
    @Req() req: Request,
    @Body() voteData: { direction?: 'up' | 'down' },
  ) {
    return await this.reportService.vote(
      param,
      req.user.id,
      voteData?.direction || 'up',
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post(':reportId/share')
  async share(@Param() param: ReportIdDto, @Req() req: Request) {
    return await this.reportService.share(param, req.user.id);
  }

  @HttpCode(204)
  @Post(':reportId/resolve')
  async resolve() {}

  @UseGuards(RoleGuard, PermissionGuard)
  @Roles(UserRole.ADMIN)
  @Permissions(PERMISSIONS.reports.resolve)
  @HttpCode(HttpStatus.OK)
  @Post(':reportId/approve')
  async approveReport(
    @Param() param: ReportIdDto,
    @Req() req: Request,
    @Body() approvalData: ApproveReportDto,
  ) {
    return await this.reportService.approveReport(param.reportId, {
      approvedBy: req.user.id,
      ...approvalData,
    });
  }

  @HttpCode(204)
  @Post(':reportId/escalate')
  async escalateReport(
    @Param() param: ReportIdDto,
    @Body() escalationData: { escalateTo: string; reason: string },
  ) {
    return await this.reportService.escalateReport(
      param.reportId,
      escalationData,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post(':reportId/discussion/join')
  async joinDiscussion(@Param() param: ReportIdDto, @Req() req: Request) {
    const requestUser = req.user as any;
    return await this.reportService.joinDiscussionThread(param.reportId, {
      role: requestUser.role,
      userId: requestUser.id,
      politicianId: requestUser.politicianId || requestUser.id,
    });
  }

  @Get(':reportId/discussion')
  async getDiscussion(@Param() param: ReportIdDto, @Req() req: Request) {
    const requestUser = req.user as any;
    return await this.reportService.getDiscussionThread(param.reportId, {
      role: requestUser.role,
      userId: requestUser.id,
      politicianId: requestUser.politicianId || requestUser.id,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post(':reportId/discussion/comments')
  async addDiscussionComment(
    @Param() param: ReportIdDto,
    @Body() body: CreateReportDiscussionCommentDto,
    @Req() req: Request,
  ) {
    const requestUser = req.user as any;
    return await this.reportService.addDiscussionComment(
      param.reportId,
      body.content,
      {
        role: requestUser.role,
        userId: requestUser.id,
        politicianId: requestUser.politicianId || requestUser.id,
      },
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post(':reportId/discussion/comments/:commentId/reply')
  async replyToDiscussionComment(
    @Param() param: ReportIdDto,
    @Param('commentId') commentId: string,
    @Body() body: CreateReportDiscussionCommentDto,
    @Req() req: Request,
  ) {
    const requestUser = req.user as any;
    return await this.reportService.replyToDiscussionComment(
      param.reportId,
      commentId,
      body.content,
      {
        role: requestUser.role,
        userId: requestUser.id,
        politicianId: requestUser.politicianId || requestUser.id,
      },
    );
  }

  @HttpCode(HttpStatus.OK)
  @Put(':reportId/discussion/comments/:commentId/vote')
  async voteOnDiscussionComment(
    @Param() param: ReportIdDto,
    @Param('commentId') commentId: string,
    @Body() body: VoteReportDiscussionCommentDto,
    @Req() req: Request,
  ) {
    const requestUser = req.user as any;
    return await this.reportService.voteOnDiscussionComment(
      param.reportId,
      commentId,
      body.direction || 'up',
      {
        role: requestUser.role,
        userId: requestUser.id,
        politicianId: requestUser.politicianId || requestUser.id,
      },
    );
  }
}
