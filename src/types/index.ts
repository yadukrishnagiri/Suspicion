export interface User {
  id: string;
  name: string;
}

export interface AppConfig {
  version: string;
  environment: "development" | "staging" | "production";
}
