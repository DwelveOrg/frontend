import { Laptop, ShieldCheck, Smartphone } from "lucide-react";
import type { LoginHistoryItem } from "../_types";

export const loginHistoryItems: LoginHistoryItem[] = [
  {
    id: 1,
    deviceKey: "root.settings.loginHistory.page.items.0.device",
    locationKey: "root.settings.loginHistory.page.items.0.location",
    timeKey: "root.settings.loginHistory.page.items.0.time",
    statusKey: "root.settings.loginHistory.page.items.0.status",
    blocked: false,
    icon: Laptop,
  },
  {
    id: 2,
    deviceKey: "root.settings.loginHistory.page.items.1.device",
    locationKey: "root.settings.loginHistory.page.items.1.location",
    timeKey: "root.settings.loginHistory.page.items.1.time",
    statusKey: "root.settings.loginHistory.page.items.1.status",
    blocked: false,
    icon: Smartphone,
  },
  {
    id: 3,
    deviceKey: "root.settings.loginHistory.page.items.2.device",
    locationKey: "root.settings.loginHistory.page.items.2.location",
    timeKey: "root.settings.loginHistory.page.items.2.time",
    statusKey: "root.settings.loginHistory.page.items.2.status",
    blocked: false,
    icon: Laptop,
  },
  {
    id: 4,
    deviceKey: "root.settings.loginHistory.page.items.3.device",
    locationKey: "root.settings.loginHistory.page.items.3.location",
    timeKey: "root.settings.loginHistory.page.items.3.time",
    statusKey: "root.settings.loginHistory.page.items.3.status",
    blocked: true,
    icon: ShieldCheck,
  },
];
