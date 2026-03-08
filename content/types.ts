export interface Article {
  title: string;
  url: string;
  publisher?: string;
  date?: string;
  type: "blog" | "press";
  featured?: boolean;
}

export interface Reflection {
  title: string;
  url: string;
  emoji?: string;
}

export interface Affiliation {
  name: string;
  title: string;
  url: string;
  status: "current" | "past";
}
