export const PERMISSIONS = {
  dashboard: {
    view: "dashboard:view",
  },

  users: {
    view: "users.view",
    create: "users.create",
    update: "users.update",
    delete: "users.delete",
    assignRole: "user.assign_role",
    managePermissions: "users.manage_permissions",
  },

  roles: {
    view: "roles.view",
    updatePermissions: "roles.update_permissions",
  },

  reports: {
    view: "reports.view",
    viewOwn: "reports.view_own",
    create: "reports.create",
    updateOwn: "reports.update_own",
    deleteOwn: "reports.delete_own",
    resolve: "reports.resolve",
    escalate: "reports.escalate",

    types: {
      view: "reports.types.view",
      create: "reports.types.create",
      update: "reports.types.update",
      delete: "reports.types.delete",
    },

    statuses: {
      view: "reports.statuses.view",
      create: "reports.statuses.create",
      update: "reports.statuses.update",
      delete: "reports.statuses.delete",
    },

    priorities: {
      view: "reports.priorities.view",
      create: "reports.priorities.create",
      update: "reports.priorities.update",
      delete: "reports.priorities.delete",
    },

    visibilities: {
      view: "reports.visibilities.view",
      create: "reports.visibilities.create",
      update: "reports.visibilities.update",
      delete: "reports.visibilities.delete",
    },
  },

  politicians: {
    view: "politicians.view",
    create: "politicians.create",
    update: "politicians.update",
    delete: "politicians.delete",
    createAccount: "politicians.create_account",
  },

  parties: {
    view: "parties.view",
    create: "parties.create",
    update: "parties.update",
    delete: "parties.delete",
  },

  geography: {
    view: "geography.view",
    create: "geography.create",
    update: "geography.update",
    delete: "geography.delete",
  },

  polls: {
    view: "polls.view",
    vote: "polls.vote",
    create: "polls.create",
    update: "polls.update",
    delete: "polls.delete",
    viewAnalytics: "polls.view_analytics",
  },

  messages: {
    view: "messages.view",
    create: "messages.create",
    reply: "messages.reply",
    manage: "messages.manage",
    viewJurisdiction: "messages.view_jurisdiction",
  },

  profile: {
    view: "profile.view",
    update: "profile.update",
  },

  promises: {
    view: "promises.view",
    create: "promises.create",
    update: "promises.update",
    delete: "promises.delete",
  },

  announcements: {
    view: "announcements.view",
    create: "announcements.create",
    update: "announcements.update",
    delete: "announcements.delete",
  },

  sessions: {
    view: "sessions.view",
    revoke: "sessions.revoke",
  },

  jobs: {
    view: "jobs.view",
    retry: "jobs.retry",
  },

  budget: {
    view: "budget.view",
  },

  cases: {
    view: "cases.view",
    create: "cases.create",
    update: "cases.update",
    delete: "cases.delete",
  },
} as const;
