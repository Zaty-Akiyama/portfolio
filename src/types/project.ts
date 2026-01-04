export type Project = {
  id: string;
  title: string;
  category: string;
  period: string;     // "2025.06 - 2025.08"
  role: string;       // "Member" / "FE/BE"
  summary: string;
  stack?: string[];
  labels?: string[];
  links?: { label: string; href?: string; primary?: boolean }[];
  featured?: boolean;
};
