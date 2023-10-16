import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AESService } from '../core/services/aes.service';
import { Observable, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-wstester',
  templateUrl: './wstester.page.html',
  styleUrls: ['./wstester.page.scss'],
})
export class WSTesterPage implements OnInit {
  //BASE_URL: string =
  //  'https://mcm.lab-001.arribatecmarine.com/MCM_EVO_310_SHIP/rest';
  BASE_URL: string = 'http://localhost:8080/MCM_3_1/rest';

  username: string = 'MOBILE_MCM';
  password: string = 'MOBILE_MCM';
  company: string = '001';
  getTokenResult: string = '';

  constructor(private http: HttpClient, private aes: AESService) {}

  ngOnInit() {}

  displayToken(): void {
    this.getToken().subscribe((token) => (this.getTokenResult = token));
  }

  getToken(): Observable<any> {
    return this.http
      .get(`${this.BASE_URL}/gettoken?pToken=${this.getStartToken()}`, {
        responseType: 'text',
      })
      .pipe(catchError(this.handleError('Get Token')));
  }

  getStartToken(): string {
    // must be URI encoded before sending, to avoid decrypting errors on the other side
    return encodeURIComponent(
      this.aes.encryptStr(
        this.username + '$||$' + this.password + '$||$' + this.company + '$||$'
      )
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      alert(`${operation} failed: ${error.error}`);
      return of(result as T);
    };
  }
}
