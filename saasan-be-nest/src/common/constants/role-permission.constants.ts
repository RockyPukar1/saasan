import { UserRole } from 'src/user/entities/user.entity';
import { PERMISSIONS } from './permission.constants';

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    PERMISSIONS.dashboard.view,

    PERMISSIONS.users.view,
    PERMISSIONS.users.create,
    PERMISSIONS.users.update,
    PERMISSIONS.users.delete,
    PERMISSIONS.users.assignRole,
    PERMISSIONS.users.managePermissions,

    PERMISSIONS.roles.view,
    PERMISSIONS.roles.updatePermissions,

    PERMISSIONS.reports.view,
    PERMISSIONS.reports.create,
    PERMISSIONS.reports.resolve,
    PERMISSIONS.reports.escalate,

    PERMISSIONS.reports.types.view,
    PERMISSIONS.reports.types.create,
    PERMISSIONS.reports.types.update,
    PERMISSIONS.reports.types.delete,

    PERMISSIONS.reports.statuses.view,
    PERMISSIONS.reports.statuses.create,
    PERMISSIONS.reports.statuses.update,
    PERMISSIONS.reports.statuses.delete,

    PERMISSIONS.reports.priorities.view,
    PERMISSIONS.reports.priorities.create,
    PERMISSIONS.reports.priorities.update,
    PERMISSIONS.reports.priorities.delete,

    PERMISSIONS.reports.visibilities.view,
    PERMISSIONS.reports.visibilities.create,
    PERMISSIONS.reports.visibilities.update,
    PERMISSIONS.reports.visibilities.delete,

    PERMISSIONS.politicians.view,
    PERMISSIONS.politicians.create,
    PERMISSIONS.politicians.update,
    PERMISSIONS.politicians.delete,
    PERMISSIONS.politicians.createAccount,

    PERMISSIONS.parties.view,
    PERMISSIONS.parties.create,
    PERMISSIONS.parties.update,
    PERMISSIONS.parties.delete,

    PERMISSIONS.geography.view,
    PERMISSIONS.geography.create,
    PERMISSIONS.geography.update,
    PERMISSIONS.geography.delete,

    PERMISSIONS.polls.view,
    PERMISSIONS.polls.create,
    PERMISSIONS.polls.update,
    PERMISSIONS.polls.delete,
    PERMISSIONS.polls.viewAnalytics,

    PERMISSIONS.messages.view,
    PERMISSIONS.messages.manage,
    PERMISSIONS.messages.reply,
    PERMISSIONS.messages.viewJurisdiction,

    PERMISSIONS.profile.view,
    PERMISSIONS.profile.update,

    PERMISSIONS.promises.view,
    PERMISSIONS.promises.create,
    PERMISSIONS.promises.update,
    PERMISSIONS.promises.delete,

    PERMISSIONS.announcements.view,
    PERMISSIONS.announcements.create,
    PERMISSIONS.announcements.update,
    PERMISSIONS.announcements.delete,

    PERMISSIONS.sessions.view,
    PERMISSIONS.sessions.revoke,
  ],
  [UserRole.CITIZEN]: [
    PERMISSIONS.dashboard.view,

    PERMISSIONS.profile.view,
    PERMISSIONS.profile.update,

    PERMISSIONS.reports.viewOwn,
    PERMISSIONS.reports.create,
    PERMISSIONS.reports.updateOwn,
    PERMISSIONS.reports.deleteOwn,

    PERMISSIONS.polls.view,
    PERMISSIONS.polls.vote,

    PERMISSIONS.messages.view,
    PERMISSIONS.messages.create,

    PERMISSIONS.politicians.view,
    PERMISSIONS.parties.view,
    PERMISSIONS.geography.view,
  ],
  [UserRole.POLITICIAN]: [
    PERMISSIONS.profile.view,
    PERMISSIONS.profile.update,

    PERMISSIONS.dashboard.view,

    PERMISSIONS.messages.view,
    PERMISSIONS.messages.reply,
    PERMISSIONS.messages.viewJurisdiction,

    PERMISSIONS.promises.view,
    PERMISSIONS.promises.create,
    PERMISSIONS.promises.update,
    PERMISSIONS.promises.delete,

    PERMISSIONS.announcements.view,
    PERMISSIONS.announcements.create,
    PERMISSIONS.announcements.update,
    PERMISSIONS.announcements.delete,

    PERMISSIONS.sessions.view,
    PERMISSIONS.sessions.revoke,

    PERMISSIONS.politicians.view,
    PERMISSIONS.parties.view,
    PERMISSIONS.geography.view,
  ],
};
