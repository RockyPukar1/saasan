import { Expose, Transform, Type } from 'class-transformer';

export class SourceCategories {
  @Expose() type: string;
  @Expose() priority: string;
  @Expose() visibility: string;
  @Expose() status: string;
}
export class ReportSerializer {
  @Expose() @Transform(({ obj }) => obj._id as string) id: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() @Transform(({ obj }) => obj.statusId as string) statusId: string;
  @Expose()
  @Transform(({ obj }) => obj.priorityId as string)
  priorityId: string;
  @Expose()
  @Transform(({ obj }) => obj.visibilityId as string)
  visibilityId: string;
  @Expose() @Transform(({ obj }) => obj.typeId as string) typeId: string;
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
      obj.evidences?.map((e: any) => ({
        id: e._id?.toString(),
        originalName: e.originalName,
        filePath: e.filePath, // Cloudinary URL
        fileType: e.fileType,
        uploadedAt: new Date(e.uploadedAt).toISOString(),
        cloudinaryPublicId: e.cloudinaryPublicId,
      })) || [],
  )
  evidences?: any[];
  @Expose()
  @Transform(
    ({ obj }) =>
      obj.activities?.map((a: any) => ({
        category: a.category,
        modifiedBy: {
          id: a.modifiedBy.id.toString(),
          fullName: a.modifiedBy.fullName,
        },
        oldValue: a?.oldValue,
        newValue: a.newValue,
        modifiedAt: new Date(a.modifiedAt).toISOString(),
      })) || [],
  )
  activities?: any[];
  @Expose() sharesCount: number;
  @Expose()
  @Type(() => SourceCategories)
  sourceCategories: SourceCategories;
}
