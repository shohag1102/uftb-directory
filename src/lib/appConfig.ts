import { api } from "./api";

export type AppConfig = {
  logoUrl: string;
  appName: string;
  subtitle: string;
};

export async function fetchAppConfig(): Promise<AppConfig> {
  const { data } = await api.get("/app-config", {
    timeout: 5000,
  });

  return data;
}
