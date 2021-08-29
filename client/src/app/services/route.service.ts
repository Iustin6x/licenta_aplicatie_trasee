import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:8080/api/';
@Injectable({
  providedIn: 'root'
})
export class RouteService {


  constructor(private http: HttpClient) { }

  getList(): Observable<any> {
    return this.http
      .get<any>(API_URL+'routes')
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getListDone(): Observable<any> {
    return this.http
      .get<any>(API_URL+'routes/done')
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getFollowedRoutes(id: any): Observable<any> {
    return this.http
      .get<any>(API_URL+'routes/followers/'+id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getListPlanned(): Observable<any> {
    return this.http
      .get<any>(API_URL+'routes/planned')
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getListByUsernameandType(username: any,type:any): Observable<any> {
    return this.http
      .get<any>(API_URL+'routes/'+username+'/'+type)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  get(id: any): Observable<any> {
    return this.http
    .get<any>(API_URL + 'routes/' + id)
    .pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  createItem(data: any): Observable<any> {
    return this.http.post(API_URL + 'routes', data);
  }

  update(id: any, data: any): Observable<any> {

    return this.http.put(API_URL + 'routes/' + id, data);
  }

  deleteItem(id) {
    return this.http
      .delete(API_URL+ 'routes/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
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
