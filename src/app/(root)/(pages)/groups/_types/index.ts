export type ClassStatus = "active" | "archived";

/** The current viewer's relationship to a class, used for the card role badge. */
export type ClassViewerRole = "teacher" | "student" | null;

/** A single class, mapped from the `/classes` API into card-ready fields. */
export type ClassItem = {
  id: string;
  /** Subject / class name, e.g. "Mathematics". */
  name: string;
  /** Free-form description shown as the card subtitle line. */
  description: string;
  /** Backend-served class picture, or `null` when none has been uploaded. */
  pictureUrl: string | null;
  /** Lead teacher display name (first assigned teacher), or empty. */
  teacher: string;
  studentCount: number;
  status: ClassStatus;
  /** How the current viewer relates to this class, if known. */
  viewerRole?: ClassViewerRole;
};

/** Filter applied to the class grid — "all" plus each concrete status. */
export type ClassFilter = "all" | ClassStatus;
