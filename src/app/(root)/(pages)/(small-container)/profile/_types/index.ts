export type ProfileUser = {
  id: string;
  identifier: string;
  name: string;
  role: string;
};

export type ProfileClientProps = {
  user: ProfileUser | null;
};
