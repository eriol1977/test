import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AESService } from '../core/services/aes.service';
import { Observable, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-wstester',
  templateUrl: './wstester.page.html',
  styleUrls: ['./wstester.page.scss'],
})
export class WSTesterPage implements OnInit {
  BASE_URL: string =
    'https://mcm.lab-001.arribatecmarine.com/MCM_EVO_310_SHIP/rest';
  //BASE_URL: string = 'http://localhost:8080/MCM_3_1/rest';

  serviceUsername: string = 'MOBILE_MCM';
  servicePassword: string = 'MOBILE_MCM';
  company: string = '001';
  getTokenResult: string = '';
  testTokenResult: string = '';
  username: string = 'carpenter1_vi';
  password: string = 'IB1234';

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
        this.serviceUsername +
          '$||$' +
          this.servicePassword +
          '$||$' +
          this.company +
          '$||$'
      )
    );
  }

  testToken(): void {
    this.doTestToken().subscribe((res) => (this.testTokenResult = res));
  }

  doTestToken(): Observable<any> {
    return this.http
      .get(
        `${this.BASE_URL}/validate?pToken=${encodeURIComponent(
          this.getTokenResult
        )}&pParam=${this.prepareUserData()}`,
        {
          responseType: 'text',
        }
      )
      .pipe(catchError(this.handleError('Test Token')));
  }

  private prepareUserData(): string {
    return encodeURIComponent(
      this.aes.encryptStr(
        `${this.username}${this.aes.SEPARATOR}${this.password}`
      )
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errMsg = error.error ? error.error : error.message;
      alert(`${operation} failed: ${errMsg}`);
      return of(result as T);
    };
  }
}
