import { IsIn, IsOptional } from 'class-validator';

export class VoteReportDiscussionCommentDto {
  @IsOptional()
  @IsIn(['up', 'down'])
  direction?: 'up' | 'down';
}
