import { ClassConstructor, plainToInstance } from 'class-transformer';

type PaginatedInput<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

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
    page: number,
    limit: number,
    message = 'Data retrieved successfully',
  ) {
    return this.success(data, message, {
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
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
      'page' in plain &&
      'limit' in plain
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
        paginatedData.page,
        paginatedData.limit,
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
