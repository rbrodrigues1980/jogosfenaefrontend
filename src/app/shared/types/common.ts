export interface BaseEntity {
  id?: number | string;
  createdDateTime: string;
  updatedDateTime: string;
}

export interface EditionDto extends BaseEntity {
  id?: number;
  membershipDate: string;
  bornFrom: string;
  bornUntil: string;
  startDateTime: string;
  endDateTime: string;
  linkExpirationDate: string;
  link: string;
  title: string;
  description: string;
  email: string;
  currentEdition: boolean;
}

export interface CompanyDto extends BaseEntity {
  id?: string;
  title: string;
  participantNumber: number;
  presidentNumber: number;
  sportsDirectorNumber: number;
  athleteNumber: number;
  parathleteNumber: number;
  technicalNumber: number;
  edition?: EditionDto;
}

export type ApcefOption = {
  value: string;
  label: string;
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}
