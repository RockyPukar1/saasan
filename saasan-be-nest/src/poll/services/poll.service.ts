import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { VoteDto } from '../dtos/vote.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { PollRepository } from '../repositories/poll.repository';
import { PollVoteRepository } from '../repositories/poll-vote.repository';
import { PollOptionRepository } from '../repositories/poll-option.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreatePollDto } from '../dtos/create-poll.dto';
import { PollSerializer } from '../serializers/poll.serializer';
import { MemoryCacheService } from 'src/common/cache/memory-cache.service';

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);
  
  constructor(
    private readonly pollRepo: PollRepository,
    private readonly pollVoteRepo: PollVoteRepository,
    private readonly pollOptionRepo: PollOptionRepository,
    private readonly memoryCache: MemoryCacheService,
  ) {}

  async getAll(userId: string) {
    const cacheKey = `polls:all:${userId}`;

    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return ResponseHelper.response(
        PollSerializer,
        cached,
        'Polls fetched successfully',
      );
    }
    
    const data = await this.pollRepo.getAll(userId);

    this.memoryCache.set(cacheKey, data, 300);

    return ResponseHelper.response(
      PollSerializer,
      data,
      'Polls fetched successfully',
    );
  }

  async getPollById(userId: string, pollId: string) {
    const cacheKey = `poll:details:${pollId}:${userId}`;
    
    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return ResponseHelper.response(
        PollSerializer,
        cached,
        'Poll fetched successfully',
      );
    }
    
    const poll = await this.pollRepo.getDetailsById(pollId, userId);

    if (!poll) throw new GlobalHttpException('poll404', HttpStatus.NOT_FOUND);

    this.memoryCache.set(cacheKey, poll, 600);

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

    this.memoryCache.delete(`poll:all:${userId}`);
    this.memoryCache.delete(`poll:details:${pollId}:${userId}`);
  }

  async getAnalytics() {}

  async getCategories() {
    const cacheKey = "polls:categories";

    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return ResponseHelper.success(cached);
    }
    
    const categories = await this.pollRepo.getCategories();
    this.memoryCache.set(cacheKey, categories, 3600);

    return ResponseHelper.success(categories);
  }

  async getStatuses() {
    const cacheKey = "polls:statuses";

    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return ResponseHelper.success(cached);
    }
    
    const statuses = await this.pollRepo.getStatuses();
    this.memoryCache.set(cacheKey, statuses, 3600);
    return ResponseHelper.success(statuses);
  }

  async getTypes() {
    const cacheKey = "polls:types";

    const cached = this.memoryCache.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${cacheKey}`);
      return ResponseHelper.success(cached);
    }
    
    const types = await this.pollRepo.getTypes();
    this.memoryCache.set(cacheKey, types, 3600);

    return ResponseHelper.success(types);
  }
}
