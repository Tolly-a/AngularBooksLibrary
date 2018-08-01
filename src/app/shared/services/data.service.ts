import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Book } from '../models/book';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = "https://bookslibrary-27fad.firebaseio.com/books.json";

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
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
    return throwError('Something bad happened; please try again later.');
  };

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getAllBooks(): Observable<any> {
    return this.http.get<Book[]>(apiUrl, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  storeBooks(books: any[]) {
    return this.http.put(apiUrl, books)
      .pipe(
        catchError(this.handleError)
      )
  }
}