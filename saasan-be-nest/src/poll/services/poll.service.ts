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

  async getAnalytics() {}

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
