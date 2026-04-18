export const API = {
  auth: {
    login:  { path: "/api/auth",        method: "POST" },
    logout: { path: "/api/auth/logout", method: "POST" },
  },

  setup: {
    path:   "/api/setup",
    method: "POST",
  },

  submissions: {
    path:   "/api/submissions",
    method: { GET: "GET", POST: "POST" },
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
    },
  },

  tasks: {
    path:   "/api/tasks",
    method: { GET: "GET", POST: "POST" },
    action: {
      create: "create",
      update: "update",
      delete: "delete",
    },
  },

  users: {
    path:   "/api/users",
    method: { GET: "GET", POST: "POST" },
    action: {
      create: "create",
      update: "update",
      delete: "delete",
    },
  },

  rewards: {
    path:   "/api/rewards",
    method: { GET: "GET", POST: "POST" },
    action: {
      create: "create",
      update: "update",
      delete: "delete",
    },
  },

  pushSubscription: {
    path:   "/api/push-subscription",
    method: { POST: "POST", DELETE: "DELETE" },
  },
} as const;
