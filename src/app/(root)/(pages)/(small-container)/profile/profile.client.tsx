"use client";

import Empty from "../../_components/ui/Empty";
import type { ProfileClientProps } from "./_types";

export default function ProfileClient({ user }: Readonly<ProfileClientProps>) {

  if (!user) {
    return (
      <div className="flex min-h-[calc(100dvh-12rem)] w-full items-center justify-center">
        <Empty />
      </div>
    );
  }

  return null;
}
