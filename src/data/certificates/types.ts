export interface Certificate {
  title: string;
  drive_link: string;
}

export interface StudentCertificate {
  name: string;
  nim: string;
  division: string;
  team_name: string;
  certificates: Certificate[];
}
