import { http, HttpResponse } from "msw";

import { mockSubmissions, mockTasks, mockUsers, mockRewards } from "@stories/mockData";

export const handlers = [
    http.get("/api/submissions", () => HttpResponse.json(mockSubmissions)),
    http.post("/api/submissions", () => HttpResponse.json({ ok: true })),
    http.get("/api/tasks", () => HttpResponse.json(mockTasks)),
    http.post("/api/tasks", () => HttpResponse.json({ ok: true })),
    http.get("/api/users", () => HttpResponse.json(mockUsers)),
    http.post("/api/users", () => HttpResponse.json({ ok: true })),
    http.get("/api/rewards", () => HttpResponse.json(mockRewards)),
    http.post("/api/rewards", () => HttpResponse.json({ ok: true })),
    http.get("/api/auth", () => HttpResponse.json(null, { status: 401 })),
];
