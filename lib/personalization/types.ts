export interface VisitorContext {
  city?: string;
  country?: string;
  region?: string;
  latitude?: string;
  longitude?: string;
  timezone?: string;
  locale?: string;
  timestamp: number;
}

export interface PersonalizationStrategy<T = unknown> {
  name: string;
  mode: "stream" | "sync";
  execute(context: VisitorContext): T;
}
