import { ClassConstructor, plainToInstance } from 'class-transformer';
import { CursorPaginatedInput } from './cursor-pagination.helper';

type PaginatedInput<T> = CursorPaginatedInput<T>;

export class ResponseHelper {
  static success(data: any, message = 'Success', meta?: any) {
    return {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated(
    data: any[],
    total: number,
    limit: number,
    nextCursor: string | null,
    hasNext: boolean,
    message = 'Data retrieved successfully',
  ) {
    return this.success(data, message, {
      pagination: {
        total,
        limit,
        nextCursor,
        hasNext,
      },
    });
  }

  private static isPaginatedInput<T>(plain: unknown): plain is PaginatedInput<T> {
    return (
      !!plain &&
      typeof plain === 'object' &&
      'data' in plain &&
      Array.isArray((plain as PaginatedInput<T>).data) &&
      'total' in plain &&
      'limit' in plain &&
      'nextCursor' in plain &&
      'hasNext' in plain
    );
  }

  static response<T>(
    cls: ClassConstructor<T>,
    plain: unknown,
    message = 'Success',
  ) {
    if (this.isPaginatedInput(plain)) {
      const paginatedData = plain;
      const serializedItems = plainToInstance(cls, paginatedData.data, {
        strategy: 'excludeAll',
        exposeUnsetFields: false,
        excludeExtraneousValues: true,
      });

      return this.paginated(
        serializedItems,
        paginatedData.total,
        paginatedData.limit,
        paginatedData.nextCursor,
        paginatedData.hasNext,
        message,
      );
    }

    const serializedData = plainToInstance(cls, plain, {
      strategy: 'excludeAll',
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    });

    return this.success(serializedData, message);
  }
}
