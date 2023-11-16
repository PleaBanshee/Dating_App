export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

// Receives a generic type
export class PaginatedResults<T> {
  result?: T;
  pagination?: Pagination;
}
