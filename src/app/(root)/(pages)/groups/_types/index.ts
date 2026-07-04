export type ClassStatus = "active" | "archived";

/** A single class as it will eventually arrive from the classes API. */
export type ClassItem = {
  id: string;
  /** Subject / class name, e.g. "Mathematics". */
  name: string;
  /** Course or level line under the name, e.g. "Algebra II". */
  course: string;
  /** Lead teacher display name. */
  teacher: string;
  studentCount: number;
  status: ClassStatus;
};

/** Filter applied to the class grid — "all" plus each concrete status. */
export type ClassFilter = "all" | ClassStatus;
