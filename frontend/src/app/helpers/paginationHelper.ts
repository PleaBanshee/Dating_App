import { HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PaginatedResults } from '../models/pagination';
import { HttpClient } from '@angular/common/http';

export function getPaginatedResult<T>(
  url: string,
  params: HttpParams,
  httpClient: HttpClient
): Observable<PaginatedResults<T>> {
  const paginatedResult: PaginatedResults<T> = new PaginatedResults<T>();
  // Full HTTP response should be observed, and any query parameters should be included.
  return httpClient
    .get<PaginatedResults<T>>(url, {
      observe: 'response',
      params,
    })
    .pipe(
      map((res) => {
        if (res.body) {
          paginatedResult.result = res.body as T;
        }
        const pagination = res.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult as PaginatedResults<T>;
      })
    );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();
  params = params.append('pageNumber', pageNumber);
  params = params.append('pageSize', pageSize);
  return params;
}
