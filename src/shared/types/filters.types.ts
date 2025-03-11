export enum ESortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IPaginatedResponse<TData> {
  data: TData;
  total: number;
  page: number;
  size: number;
}
