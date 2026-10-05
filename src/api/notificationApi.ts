import { api } from "@/lib/api";

export type RegisterPushTokenPayload = {
  token: string;
  platform: "android" | "ios";
};

export async function registerPushToken(payload: RegisterPushTokenPayload) {
  const { data } = await api.post("/api/notifications/register", payload);
  return data;
}
