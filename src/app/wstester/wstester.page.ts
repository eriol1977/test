import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AESService } from '../core/services/aes.service';
import { Observable, catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wstester',
  templateUrl: './wstester.page.html',
  styleUrls: ['./wstester.page.scss'],
})
export class WSTesterPage implements OnInit {
  BASE_URL: string = `${environment.mcmURL}/rest`;

  serviceUsername: string = environment.serviceUser;
  servicePassword: string = environment.servicePassword;
  company: string = '001';
  getTokenResult: string = '';
  testTokenResult: string = '';
  username: string = environment.loggedUser;
  password: string = environment.loggedPassword;
  queryId: string = '9';
  queryFilters: string = '';
  queryResult: string = '';

  constructor(
    private http: HttpClient,
    private aes: AESService,
    private router: Router
  ) {}

  ngOnInit() {}

  displayToken(): void {
    this.getTokenResult = '';
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
    this.testTokenResult = '';
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

  query(): void {
    this.queryResult = '';
    this.doQuery().subscribe((res) => (this.queryResult = JSON.stringify(res)));
  }

  /**
   * Es. pFilters:
   * 0$||$$||$$||$$||$2023-04-01 00:00:00.0$||$$||$ (records with update time >= than the informed timestamp)
   * 0$||$$||$$||$100$||$$||$$||$ (the first 100 records)
   * 0$||$$||$$||$$||$$||$7$||$ (the exact record with RECORDCOUNTER field == 7)
   * 0$||$1004$||$$||$$||$$||$7$||$ (applies extra filters defined in mm_export_filter for FILTERUSERCODE 1004)
   * 0$||$$||$1016$||$$||$$||$7$||$ (applies extra filters defined in mm_export_filter for FILTERUSERGROUPCODE 1016)
   * Obs: the first parameter can be 0 (don't trim result) or 1 (trim result)
   */
  doQuery(): Observable<any> {
    return this.http
      .get(
        `${this.BASE_URL}/query?pToken=${encodeURIComponent(
          this.getTokenResult
        )}&pQueryId=${encodeURIComponent(
          this.aes.encryptStr(this.queryId)
        )}&pFilters=${encodeURIComponent(
          this.aes.encryptStr(this.queryFilters)
        )}`
      )
      .pipe(catchError(this.handleError('Test Token')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let errMsg = error.error ? error.error : error.message;
      alert(`${operation} failed: ${errMsg}`);
      return of(result as T);
    };
  }

  goBack(): void {
    this.router.navigate(['/landing']);
  }
}
