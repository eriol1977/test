import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
export class Student {
  id?: string;
  username?: string;
  email?: string;
  phone?: number;
}
@Injectable({
  providedIn: 'root',
})
export class WorkRequestRestService {
  URL: string = 'https://jsonplaceholder.typicode.com/users';

  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  addStudent(student: Student): Observable<any> {
    return this.http
      .post<Student>(`${this.URL}/`, student, this.httpHeader)
      .pipe(catchError(this.handleError<Student>('Add Student')));
  }

  getStudent(id: any): Observable<Student> {
    return this.http.get<Student>(`${this.URL}/` + id).pipe(
      tap((_) => console.log(`Student fetched: ${id}`)),
      catchError(this.handleError<Student>(`Get student id=${id}`))
    );
  }

  getStudentList(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.URL}/`).pipe(
      tap((stArray: Student[]) => {
        stArray.forEach((st) => (st.username += '-PIPPO'));
      }),
      catchError(this.handleError<Student[]>('Get student', []))
    );
  }

  updateStudent(id: any, student: Student): Observable<any> {
    return this.http.put(`${this.URL}/` + id, student, this.httpHeader).pipe(
      tap((_) => console.log(`Student updated: ${id}`)),
      catchError(this.handleError<Student[]>('Update student'))
    );
  }

  deleteStudent(id: any): Observable<Student[]> {
    return this.http
      .delete<Student[]>(`${this.URL}/` + id, this.httpHeader)
      .pipe(
        tap((_) => console.log(`Student deleted: ${id}`)),
        catchError(this.handleError<Student[]>('Delete student'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
