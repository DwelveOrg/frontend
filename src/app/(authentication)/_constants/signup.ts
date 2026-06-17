import type {
  AdminSignupFormField,
  RegularSignupFormField,
} from "../_types/_schemas";
import type { CenterSizeOption, CenterTypeOption } from "../_types/options";

export const regularSignupDefaults: RegularSignupFormField = {
  fullName: "",
  email: "",
  password: "",
};

export const adminSignupDefaults: AdminSignupFormField = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  centerName: "",
  centerType: "tutoring",
  centerSize: "sm",
  termsAccepted: false,
};

export const adminSignupStepFields: Array<Array<keyof AdminSignupFormField>> = [
  ["fullName", "email", "password", "confirmPassword"],
  ["centerName", "centerType", "centerSize"],
  ["termsAccepted"],
];

export const adminSignupStepCount = adminSignupStepFields.length;

export const centerTypeOptions: CenterTypeOption[] = [
  { value: "tutoring", labelKey: "auth.adminSignup.type_tutoring" },
  { value: "privateSchool", labelKey: "auth.adminSignup.type_privateSchool" },
  { value: "language", labelKey: "auth.adminSignup.type_language" },
  { value: "examPrep", labelKey: "auth.adminSignup.type_examPrep" },
  { value: "university", labelKey: "auth.adminSignup.type_university" },
  { value: "other", labelKey: "auth.adminSignup.type_other" },
];

export const centerSizeOptions: CenterSizeOption[] = [
  { value: "sm", labelKey: "auth.adminSignup.size_sm" },
  { value: "md", labelKey: "auth.adminSignup.size_md" },
  { value: "lg", labelKey: "auth.adminSignup.size_lg" },
  { value: "xl", labelKey: "auth.adminSignup.size_xl" },
];
