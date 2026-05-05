import { Types } from 'mongoose';

export type CursorPaginatedInput<T> = {
  data: T[];
  total: number;
  limit: number;
  nextCursor: string | null;
  hasNext: boolean;
};

const encodePayload = (payload: Record<string, string>) =>
  Buffer.from(JSON.stringify(payload)).toString('base64url');

const decodePayload = (cursor?: string | null): Record<string, string> | null => {
  if (!cursor) {
    return null;
  }

  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
    return JSON.parse(decoded) as Record<string, string>;
  } catch {
    return null;
  }
};

export const encodeCursor = (value: string | Types.ObjectId) =>
  encodePayload({ id: value.toString() });

export const decodeCursor = (cursor?: string | null) =>
  decodePayload(cursor)?.id ?? null;

export const decodeObjectIdCursor = (cursor?: string | null) => {
  const id = decodeCursor(cursor);

  if (!id || !Types.ObjectId.isValid(id)) {
    return null;
  }

  return new Types.ObjectId(id);
};

export const descendingObjectIdCursorFilter = (cursor?: string | null) => {
  const cursorId = decodeObjectIdCursor(cursor);

  if (!cursorId) {
    return {};
  }

  return {
    _id: {
      $lt: cursorId,
    },
  };
};

export const toCursorPaginatedResult = <T>(
  items: T[],
  limit: number,
  total: number,
  getCursorValue: (item: T) => string | Types.ObjectId | undefined = (
    item: any,
  ) => item?._id,
): CursorPaginatedInput<T> => {
  const pageItems = items.slice(0, limit);
  const hasNext = items.length > limit;
  const lastItem = pageItems[pageItems.length - 1];
  const cursorValue = lastItem ? getCursorValue(lastItem) : undefined;

  return {
    data: pageItems,
    total,
    limit,
    nextCursor:
      hasNext && cursorValue ? encodeCursor(cursorValue.toString()) : null,
    hasNext,
  };
};

export const paginateArrayByCursor = <T>(
  items: T[],
  cursor: string | undefined,
  limit: number,
  getCursorValue: (item: T) => string | Types.ObjectId | undefined = (
    item: any,
  ) => item?._id,
): CursorPaginatedInput<T> => {
  const cursorId = decodeCursor(cursor);
  const startIndex = cursorId
    ? items.findIndex((item) => getCursorValue(item)?.toString() === cursorId) + 1
    : 0;

  const normalizedStartIndex = Math.max(startIndex, 0);
  const pagedItems = items.slice(normalizedStartIndex, normalizedStartIndex + limit + 1);

  return toCursorPaginatedResult(pagedItems, limit, items.length, getCursorValue);
};
