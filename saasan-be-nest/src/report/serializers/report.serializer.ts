import { Expose, Transform, Type } from 'class-transformer';

export class ReportSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() status: string;
  @Expose() priority: string;
  @Expose() upvotesCount: number;
  @Expose() downvotesCount: number;
  @Expose() viewsCount: number;
  @Expose() referenceNumber: string;
  @Expose() tags: string[];
  @Expose() isAnonymous: boolean;
  @Expose()
  @Transform(({ obj }) => new Date(obj.createdAt).toISOString())
  createdAt: string;
  @Expose()
  @Transform(({ obj }) => new Date(obj.updatedAt).toISOString())
  updatedAt: string;
  @Expose()
  @Transform(
    ({ obj }) =>
      obj.evidence?.map((e: any) => ({
        id: e._id?.toString(),
        originalName: e.originalName,
        filePath: e.filePath, // Cloudinary URL
        fileType: e.fileType,
        uploadedAt: new Date(e.uploadedAt).toISOString(),
        cloudinaryPublicId: e.cloudinaryPublicId,
      })) || [],
  )
  evidence: any[];
  @Expose()
  @Transform(
    ({ obj }) =>
      obj.statusUpdates?.map((s: any) => ({
        ...s,
        createdAt: s.createdAt
          ? new Date(s.createdAt).toISOString()
          : new Date().toISOString(),
      })) || [],
  )
  statusUpdates: any[];
  @Expose() sharesCount: number;
}
