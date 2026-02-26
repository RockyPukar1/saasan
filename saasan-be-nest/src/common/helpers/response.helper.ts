import { ClassConstructor, plainToInstance } from 'class-transformer';

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

  static paginated(data: any[], total: number, page: number, limit: number) {
    return this.success(data, 'Data retrieved successfully', {
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

  static response<T>(
    cls: ClassConstructor<T>,
    plain: unknown,
    message?: string,
  ) {
    if (plain && typeof plain === 'object' && 'data' in plain) {
      const paginatedData = plain as {
        data: unknown[];
        total: number;
        page: number;
        limit: number;
      };
      const serializedItems = plainToInstance(cls, paginatedData.data, {
        strategy: 'excludeAll',
        exposeUnsetFields: false,
        excludeExtraneousValues: true,
      });

      return this.success(
        {
          data: serializedItems,
          total: paginatedData.total,
          page: paginatedData.page,
          limit: paginatedData.limit,
        },
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
