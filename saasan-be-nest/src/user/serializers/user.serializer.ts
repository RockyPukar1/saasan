import { Expose, Transform, Type } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

const asPlainObject = (value: any) =>
  typeof value?.toObject === 'function' ? value.toObject() : value;

const asStringId = (value: any) => value?.toString?.() || value;

export class UserSerializer {
  @Expose()
  @Transform(({ obj }) => asStringId(obj._id || obj.id))
  id: string;
  @Expose() email: string;
  @Expose() fullName?: string;
  @Expose() role: string;
  @Expose() isActive: boolean;
  @Expose() isVerified: boolean;
  @Expose() provinceId?: string;
  @Expose() districtId?: string;
  @Expose() municipalityId?: string;
  @Expose() wardId?: string;
  @Expose() constituencyId?: string;
  @Expose() phone?: string;
  @Expose() avatarUrl?: string;
  @Expose() designation?: string;
  @Expose() department?: string;
  @Expose()
  @Transform(({ obj }) => obj.politicianId?.toString?.() || obj.politicianId)
  politicianId?: string;
  @Expose() profile?: Record<string, unknown>;
  @Expose() lastActiveAt?: string;
  @Expose() createdAt: string;
  @Expose() updatedAt: string;

  static toPayload(user: any, profile?: any) {
    const plainUser = asPlainObject(user) || {};
    const plainProfile = asPlainObject(profile);
    const { password, ...safeUser } = plainUser;

    return {
      ...safeUser,
      profile: plainProfile,
      fullName: plainProfile?.fullName || safeUser.fullName || safeUser.email,
      provinceId: asStringId(plainProfile?.provinceId || safeUser.provinceId),
      districtId: asStringId(plainProfile?.districtId || safeUser.districtId),
      municipalityId: asStringId(
        plainProfile?.municipalityId || safeUser.municipalityId,
      ),
      wardId: asStringId(plainProfile?.wardId || safeUser.wardId),
      constituencyId: asStringId(
        plainProfile?.constituencyId || safeUser.constituencyId,
      ),
      phone: plainProfile?.phone || plainProfile?.contact?.phone,
      avatarUrl: plainProfile?.avatarUrl || plainProfile?.photoUrl,
      designation: plainProfile?.designation,
      department: plainProfile?.department,
      politicianId:
        safeUser.role === UserRole.POLITICIAN
          ? asStringId(safeUser.politicianId || plainProfile?._id)
          : undefined,
    };
  }
}

export class UserProfilePayloadSerializer {
  @Expose()
  @Type(() => UserSerializer)
  user: UserSerializer;

  @Expose() profile?: Record<string, unknown>;
  @Expose() permissions?: string[];
  @Expose() nestedPermissions?: Record<string, unknown>;
}
