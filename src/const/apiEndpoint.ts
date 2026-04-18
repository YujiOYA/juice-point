export const API = {
  auth: {
    login:  { path: "/api/auth",        method: "POST" as const },
    logout: { path: "/api/auth/logout", method: "POST" as const },
  },

  setup: {
    path:   "/api/setup",
    method: "POST" as const,
  },

  submissions: {
    path:   "/api/submissions",
    method: { GET: "GET", POST: "POST" } as const,
    action: {
      register:            "register",
      registerOneTimeTask: "registerOneTimeTask",
      requestTask:         "requestTask",
      approve:             "approve",
      approveOneTimeTask:  "approveOneTimeTask",
      approveTaskRequest:  "approveTaskRequest",
      disapprove:          "disapprove",
      restore:             "restore",
      delete:              "delete",
      updatePoint:         "updatePoint",
      usePoints:           "usePoints",
    } as const,
  },

  tasks: {
    path:   "/api/tasks",
    method: { GET: "GET", POST: "POST" } as const,
    action: {
      create: "create",
      update: "update",
      delete: "delete",
    } as const,
  },

  users: {
    path:   "/api/users",
    method: { GET: "GET", POST: "POST" } as const,
    action: {
      create: "create",
      update: "update",
      delete: "delete",
    } as const,
  },

  rewards: {
    path:   "/api/rewards",
    method: { GET: "GET", POST: "POST" } as const,
    action: {
      create: "create",
      update: "update",
      delete: "delete",
    } as const,
  },

  pushSubscription: {
    path:   "/api/push-subscription",
    method: { POST: "POST", DELETE: "DELETE" } as const,
  },
} as const;
