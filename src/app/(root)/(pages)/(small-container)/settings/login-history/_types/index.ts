import type { LucideIcon } from "lucide-react";

export type LoginHistoryItem = {
  id: number;
  deviceKey: string;
  locationKey: string;
  timeKey: string;
  statusKey: string;
  blocked: boolean;
  icon: LucideIcon;
};
