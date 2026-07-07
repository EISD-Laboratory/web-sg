export type Division =
  | "UI/UX Design"
  | "Software Development"
  | "Technopreneur"
  | "Intelligence System";

export interface StudentResult {
  name: string;
  nim: string;
  division: Division;
  status: "Passed" | "Failed";
}
