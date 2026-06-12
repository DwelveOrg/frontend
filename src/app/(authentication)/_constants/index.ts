import type { SignupFormField } from "../_types/_schemas";
import type { AuthRoleOption } from "../_types";

export const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/groups",
  "/school",
  "/assignments",
  "/assignments/homework",
  "/assignments/exams",
];

export const publicRoutes = ["/login", "/signup"];

export const signupStepFields: Array<Array<keyof SignupFormField>> = [
  ["role", "fullName", "email"],
  ["verificationCode"],
  ["username", "password", "confirmPassword", "termsAccepted"],
];

export const defaultSignupValues: SignupFormField = {
  role: "student",
  fullName: "",
  email: "",
  verificationCode: "",
  username: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
};

export const authRoleOptions: AuthRoleOption[] = [
  { value: "student", labelKey: "auth.signup.student" },
  { value: "teacher", labelKey: "auth.signup.teacher" },
];

export const demoVerificationCode = "123456";

export const testUsers = [
  {
    id: "1",
    identifier: "student",
    password: "123456",
    name: "student",
    role: "student"
  },
  {
    id: "2",
    identifier: "teacher",
    password: "123456",
    name: "teacher",
    role: "teacher",
  },
  {
    id: "3",
    identifier: "abdulaziz",
    password: "abdulaziz123456",
    name: "abdulaziz",
    role: "teacher",
  },
];
