import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  BASE_URL: string = `${environment.serverURL}/rest`;

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
  postEndpoint: string = 'validatereq';
  postBody: string =
    '{"IDAPP": "oighy6trfbacf5d","IDDOC": "HQS000000000191","CDUNIT": "HQS","NRDOC": "HQS-12345","DSDOC": "Diesel engine spare parts","FLSTATUS": "3F","CREATIONUSER": "1024","ROWS": [{"CPROWNUM": "1","IDITEM": "HQS000000000123","CDKEY": "CD-1234A7","CDCOST_CENTER": "100","CDACCOUNT":"5010","QTEXAM":"5","CDUOM": "EA","NTPHASE": "notes notes notes"},{"CPROWNUM": "2","IDITEM": "HQS000000000231","CDKEY": "CD-1287A9","CDCOST_CENTER": "100","CDACCOUNT":"5015","QTEXAM":"3","CDUOM": "BOX","NTPHASE": "notes"}]}';
  docid: string = '1010000006';

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
    this.doQuery().subscribe((res) => {
      this.queryResult = JSON.stringify(res);
      console.log(res);
    });
  }

  doQuery(): Observable<any> {
    return this.http
      .get(
        `${this.BASE_URL}/query?pToken=${encodeURIComponent(
          this.getTokenResult
        )}&pQueryId=${encodeURIComponent(this.queryId)}${this.queryFilters}`
      )
      .pipe(catchError(this.handleError('Test Token')));
  }

  testPost(): void {
    this.doPost().subscribe((res) => {
      console.log(res);
    });
  }

  private doPost(): Observable<any> {
    return this.http
      .post(
        `${this.BASE_URL}/${this.postEndpoint}?pToken=${encodeURIComponent(
          this.getTokenResult
        )}`,
        JSON.parse(this.postBody),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          responseType: 'text',
        }
      )
      .pipe(catchError(this.handleError('Test POST')));
  }

  getAttachment(): void {
    this.doGetAttachment().subscribe((res) => console.log(res));
  }

  private doGetAttachment(): Observable<any> {
    return this.http
      .get(
        `${this.BASE_URL}/attach?pToken=${encodeURIComponent(
          this.getTokenResult
        )}&pDOCID=${encodeURIComponent(this.docid)}`,
        {
          responseType: 'text',
        }
      )
      .pipe(catchError(this.handleError('Get Attachment')));
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
