import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  ExportType,
  REQHeader,
  REQRow,
  FinancialStruct,
  REQValidated,
} from 'src/app/common/models';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
import { DataManager } from '../datamanager/data-manager';
import { Msg } from 'src/app/common/models';
import { AESService } from './aes.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SyncServicePurchase {
  // prettier-ignore
  private httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  private token: string = '';

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private loadingService: LoaderService,
    private dataManager: DataManager,
    private aes: AESService
  ) {}

  synchronize(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.loadingService
        .show({
          message: 'Purchase synchronization...',
        })
        .then(() => {
          this.getToken().subscribe(() => {
            this.validateUser().subscribe(() => {
              const ops: Observable<any>[] = [];

              ops.push(this.exportAll());

              // the initial import is done only if there is no data yet
              this.dataManager.hasMasterData().subscribe((result) => {
                if (!result) ops.push(this.importAll());

                forkJoin(ops).subscribe(() => {
                  this.token = '';
                  console.log('Purchase synchronization completed');
                  observer.next();
                  observer.complete();
                });
              });
            });
          });
        });
    });
    return observable;
  }

  ///////////////////////// IMPORT //////////////////////////////

  importAll(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // executes all the async imports before proceeding
      const imports: Observable<any>[] = [];
      imports.push(this.importREQHeaders());
      imports.push(this.importREQRows());
      imports.push(this.importFinancialStructure());

      forkJoin(imports).subscribe({
        next: ([REQHeaders, REQRows, financialStruct]) => {
          // cannot use forkJoin here, because of transaction issues when using SQLiteDataManager:
          // the set operations cannot be executed in parallel
          this.loadingService.addMessage(Msg.MSG_SAVE_REQ_HEADERS);
          this.dataManager.setREQHeadersList(REQHeaders).subscribe(() => {
            this.loadingService.removeMessage(Msg.MSG_SAVE_REQ_HEADERS);

            this.loadingService.addMessage(Msg.MSG_SAVE_REQ_ROWS);
            this.dataManager.setREQRowsList(REQRows).subscribe(() => {
              this.loadingService.removeMessage(Msg.MSG_SAVE_REQ_ROWS);

              this.loadingService.addMessage(Msg.MSG_SAVE_FIN_STRUCT);
              this.dataManager
                .setFinancialStruct(financialStruct)
                .subscribe(() => {
                  this.loadingService.removeMessage(Msg.MSG_SAVE_FIN_STRUCT);
                  console.log('Import completed');
                  observer.next();
                  observer.complete();
                });
            });
          });
        },
        error: (e) => {
          this.handleError(e);
        },
      });
    });
    return observable;
  }

  private buildQueryURL(queryId: string): string {
    return `${environment.serverURL}/rest/query?pToken=${encodeURIComponent(
      this.token
    )}&pQueryId=${encodeURIComponent(queryId)}`;
  }

  importREQHeaders(): Observable<REQHeader[]> {
    this.loadingService.addMessage(Msg.MSG_IMPORT_REQ_HEADERS);
    return this.http
      .get<REQHeader[]>(this.buildQueryURL('5001'), this.httpHeader)
      .pipe(
        tap((array) => {
          console.log(`${array.length} REQ Headers imported`);
          this.loadingService.removeMessage(Msg.MSG_IMPORT_REQ_HEADERS);
        })
      );
  }

  importREQRows(): Observable<REQRow[]> {
    this.loadingService.addMessage(Msg.MSG_IMPORT_REQ_ROWS);
    return this.http
      .get<REQRow[]>(this.buildQueryURL('5002'), this.httpHeader)
      .pipe(
        tap((array) => {
          console.log(`${array.length} REQ Rows imported`);
          this.loadingService.removeMessage(Msg.MSG_IMPORT_REQ_ROWS);
        })
      );
  }

  importFinancialStructure(): Observable<FinancialStruct[]> {
    this.loadingService.addMessage(Msg.MSG_IMPORT_FIN_STRUCT);
    return this.http
      .get<FinancialStruct[]>(this.buildQueryURL('5003'), this.httpHeader)
      .pipe(
        tap((array) => {
          console.log(`${array.length} Financial Struct records imported`);
          this.loadingService.removeMessage(Msg.MSG_IMPORT_FIN_STRUCT);
        })
      );
  }

  ///////////////////////// EXPORT //////////////////////////////

  exportAll(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
    return observable;
  }

  exportREQ(req: REQValidated): Observable<any> {
    this.loadingService.show({
      message: Msg.MSG_EXPORT_REQ,
    });
    return this.http.post<string>(
      `${environment.serverURL}/rest/validatereq?pToken=${encodeURIComponent(
        this.token
      )}`,
      req,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'text' as 'json',
      }
    );
  }

  // to be called from outside SyncServicePurchase
  // (automatically provides the necessary token)
  export(exportType: ExportType, record: any): Observable<any> {
    const observable = new Observable<any>((observer) => {
      this.getToken().subscribe(() => {
        this.validateUser().subscribe(() => {
          switch (exportType) {
            case ExportType.REQ:
              this.exportREQ(record).subscribe({
                next: (res) => {
                  this.token = '';
                  observer.next(res);
                  observer.complete();
                },
                error: (e) => {
                  this.handleError(e);
                },
              });
              break;
          }
        });
      });
    });
    return observable;
  }

  ///////////////////////// TOKEN //////////////////////////////

  private getToken(): Observable<string> {
    const observable = new Observable<string>((observer) => {
      this.doGetToken().subscribe({
        next: (res) => {
          this.token = res.trim();
          observer.next(this.token);
          observer.complete();
        },
        error: (e) => {
          this.handleError(e);
        },
      });
    });
    return observable;
  }

  private doGetToken(): Observable<any> {
    return this.http.get(
      `${
        environment.serverURL
      }/rest/gettoken?pToken=${this.prepareTokenForRequest()}`,
      {
        responseType: 'text',
      }
    );
  }

  private prepareTokenForRequest(): string {
    // must be URI encoded before sending, to avoid decrypting errors on the other side
    return encodeURIComponent(
      this.aes.encryptStr(
        environment.serviceUser +
          this.aes.SEPARATOR +
          environment.servicePassword +
          this.aes.SEPARATOR +
          environment.serviceCompany +
          this.aes.SEPARATOR
      )
    );
  }

  ///////////////////////// USER VALIDATION //////////////////////////////

  private validateUser(): Observable<any> {
    const observable = new Observable<any>((observer) => {
      this.doValidateUser().subscribe({
        next: () => {
          observer.next(this.token);
          observer.complete();
        },
        error: (e) => {
          this.handleError(e);
        },
      });
    });
    return observable;
  }

  private doValidateUser(): Observable<any> {
    return this.http.get(
      `${environment.serverURL}/rest/validate?pToken=${encodeURIComponent(
        this.token
      )}&pParam=${this.prepareUserInfoForRequest()}`,
      {
        responseType: 'text',
      }
    );
  }

  private prepareUserInfoForRequest(): string {
    // must be URI encoded before sending, to avoid decrypting errors on the other side
    return encodeURIComponent(
      this.aes.encryptStr(
        environment.loggedUser + this.aes.SEPARATOR + environment.loggedPassword
      )
    );
  }

  private handleError(e: HttpErrorResponse) {
    this.toastService.showError(e.error);
    this.loadingService.hide();
  }
}
