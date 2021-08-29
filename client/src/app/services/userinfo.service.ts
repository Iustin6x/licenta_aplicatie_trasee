import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:8080/api/users/';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  constructor(private http: HttpClient) { }

  get(username: any): Observable<any> {
    return this.http
    .get<any>(API_URL + username)
    .pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  create(data: any): Observable<any> {
    return this.http.post(API_URL , data);
  }

  update(id: any, data: any): Observable<any> {

    return this.http.put(API_URL + id, data);
  }

// Handle API errors
handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
};

}
