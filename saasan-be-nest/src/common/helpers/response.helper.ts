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
}
