import "server-only";

import type { DemoUser } from "../_types/auth";

export const demoUsers: DemoUser[] = [
  {
    id: "demo-student",
    identifier: "student",
    password: "123456",
    name: "Student",
    role: "student",
  },
  {
    id: "demo-teacher",
    identifier: "teacher",
    password: "123456",
    name: "Teacher",
    role: "teacher",
  },
];
