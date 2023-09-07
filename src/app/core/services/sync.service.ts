import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AssetLocation,
  Classification,
  ComponentAsset,
  Personnel,
  ComponentProblem,
  WorkRequest,
  Problem,
  SyncStatus,
} from 'src/app/common/models';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
import { DataManager } from '../datamanager/data-manager';
import { Msg } from 'src/app/common/models';
@Injectable({
  providedIn: 'root',
})
export class SyncService {
  URL: string =
    'https://mcm.lab-001.arribatecmarine.com/MCM_EVO_310_SHIP/wrapi';

  // prettier-ignore
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('MOBILE_MCM:MOBILE_MCM'),
    }),
  };

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private loadingService: LoaderService,
    private dataManager: DataManager
  ) {}

  synchronize(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      const ops: Observable<any>[] = [];

      ops.push(this.exportAll());

      // the initial import is done only if there is no data yet
      this.dataManager.hasMasterData().subscribe((result) => {
        if (!result) ops.push(this.importAll());

        forkJoin(ops).subscribe(() => {
          console.log('Synchronization completed');
          observer.next();
          observer.complete();
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
      imports.push(this.importAssetLocationList());
      imports.push(this.importClassificationsList());
      imports.push(this.importComponentsList());
      imports.push(this.importComponentProblemsList());
      imports.push(this.importProblemsList());
      imports.push(this.importPersonnelList());
      forkJoin(imports).subscribe(
        ([
          assetLocationData,
          classificationData,
          componentsData,
          compProblemsData,
          problemsData,
          personnelData,
        ]) => {
          // cannot use forkJoin here, because of transaction issues when using SQLiteDataManager:
          // the set operations cannot be executed in parallel
          this.loadingService.addMessage(Msg.MSG_SAVE_ASSET_LOCATIONS);
          this.dataManager
            .setAssetLocationList(assetLocationData)
            .subscribe(() => {
              this.loadingService.removeMessage(Msg.MSG_SAVE_ASSET_LOCATIONS);
              this.loadingService.addMessage(Msg.MSG_SAVE_CLASSIFICATIONS);
              this.dataManager
                .setClassificationsList(classificationData)
                .subscribe(() => {
                  this.loadingService.removeMessage(
                    Msg.MSG_SAVE_CLASSIFICATIONS
                  );
                  this.loadingService.addMessage(Msg.MSG_SAVE_COMPONENTS);
                  this.dataManager
                    .setComponentsList(componentsData)
                    .subscribe(() => {
                      this.loadingService.removeMessage(
                        Msg.MSG_SAVE_COMPONENTS
                      );
                      this.loadingService.addMessage(
                        Msg.MSG_SAVE_COMPONENT_PROBLEMS
                      );
                      this.dataManager
                        .setComponentProblemsList(compProblemsData)
                        .subscribe(() => {
                          this.loadingService.removeMessage(
                            Msg.MSG_SAVE_COMPONENT_PROBLEMS
                          );
                          this.loadingService.addMessage(Msg.MSG_SAVE_PROBLEMS);
                          this.dataManager
                            .setProblemsList(problemsData)
                            .subscribe(() => {
                              this.loadingService.removeMessage(
                                Msg.MSG_SAVE_PROBLEMS
                              );
                              this.loadingService.addMessage(
                                Msg.MSG_SAVE_PERSONNEL
                              );
                              this.dataManager
                                .setPersonnelList(personnelData)
                                .subscribe(() => {
                                  this.loadingService.removeMessage(
                                    Msg.MSG_SAVE_PERSONNEL
                                  );
                                  console.log('Import completed');
                                  observer.next();
                                  observer.complete();
                                });
                            });
                        });
                    });
                });
            });
        }
      );
    });
    return observable;
  }

  importAssetLocationList(): Observable<AssetLocation[]> {
    this.loadingService.addMessage(Msg.MSG_IMPORT_ASSET_LOCATIONS);
    return this.http
      .get<AssetLocation[]>(`${this.URL}/4002`, this.httpHeader)
      .pipe(
        map((locArray) =>
          locArray
            .filter((loc) => loc.ASLOISMAINT === 'Y' && loc.CANCELLED !== 'X')
            .sort((loc1, loc2) =>
              (loc1.ASLODESCR || '') > (loc2.ASLODESCR || '') ? 1 : -1
            )
        ), // filters active maintenance asset locations, orders by description
        tap((array) => {
          console.log(`${array.length} Asset Locations imported`);
          this.loadingService.removeMessage(Msg.MSG_IMPORT_ASSET_LOCATIONS);
        }),
        catchError(this.handleError<AssetLocation[]>('Get asset locations', []))
      );
  }

  importClassificationsList(): Observable<Classification[]> {
    this.loadingService.addMessage(Msg.MSG_IMPORT_CLASSIFICATIONS);
    return this.http
      .get<Classification[]>(`${this.URL}/4001`, this.httpHeader)
      .pipe(
        tap((array) => {
          console.log(`${array.length} Classifications imported`);
          this.loadingService.removeMessage(Msg.MSG_IMPORT_CLASSIFICATIONS);
        }),
        catchError(
          this.handleError<Classification[]>('Get classifications', [])
        )
      );
  }

  importComponentsList(): Observable<ComponentAsset[]> {
    this.loadingService.addMessage(Msg.MSG_IMPORT_COMPONENTS);
    return this.http
      .get<ComponentAsset[]>(`${this.URL}/4003`, this.httpHeader)
      .pipe(
        map((compArray) =>
          compArray.sort((comp1, comp2) =>
            (comp1.COGRDESCR || '') > (comp2.COGRDESCR || '') ? 1 : -1
          )
        ), //orders by description
        tap((array) => {
          console.log(`${array.length} Components imported`);
          this.loadingService.removeMessage(Msg.MSG_IMPORT_COMPONENTS);
        }),
        catchError(this.handleError<ComponentAsset[]>('Get components', []))
      );
  }

  importComponentProblemsList(): Observable<ComponentProblem[]> {
    this.loadingService.addMessage(Msg.MSG_IMPORT_COMPONENT_PROBLEMS);
    return this.http
      .get<ComponentProblem[]>(`${this.URL}/4005`, this.httpHeader)
      .pipe(
        tap((array) => {
          console.log(`${array.length} Component Problems imported`);
          this.loadingService.removeMessage(Msg.MSG_IMPORT_COMPONENT_PROBLEMS);
        }),
        catchError(
          this.handleError<ComponentProblem[]>('Get component problems', [])
        )
      );
  }

  importProblemsList(): Observable<Problem[]> {
    this.loadingService.addMessage(Msg.MSG_IMPORT_PROBLEMS);
    return this.http.get<Problem[]>(`${this.URL}/4004`, this.httpHeader).pipe(
      map((probArray) =>
        probArray.filter(
          (prob) => prob.CANCELLED !== 'X' && prob.PROBISSYMPTOM?.trim() === 'Y'
        )
      ), // filters active and is symptom
      tap((array) => {
        console.log(`${array.length} Problems imported`);
        this.loadingService.removeMessage(Msg.MSG_IMPORT_PROBLEMS);
      }),
      catchError(this.handleError<Problem[]>('Get problems', []))
    );
  }

  importPersonnelList(): Observable<Personnel[]> {
    this.loadingService.addMessage(Msg.MSG_IMPORT_PERSONNEL);
    return this.http.get<Personnel[]>(`${this.URL}/9`, this.httpHeader).pipe(
      map((persArray) =>
        persArray.sort((pers1, pers2) =>
          (pers1.PERSONNAME || '') > (pers2.PERSONNAME || '') ? 1 : -1
        )
      ), //orders by name
      tap((array) => {
        console.log(`${array.length} Personnel imported`);
        this.loadingService.removeMessage(Msg.MSG_IMPORT_PERSONNEL);
      }),
      catchError(this.handleError<Personnel[]>('Get personnel', []))
    );
  }

  ///////////////////////// EXPORT //////////////////////////////

  exportAll(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      const exports: Observable<any>[] = [];
      exports.push(this.exportWorkRequests());
      forkJoin(exports).subscribe(() => {
        console.log('Export completed');
        observer.next();
        observer.complete();
      });
    });
    return observable;
  }

  exportWorkRequests(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      let workRequests: WorkRequest[] = [];
      this.dataManager.getWorkRequests().subscribe((list) => {
        workRequests = list.filter(
          (wr) => wr.SYNC === SyncStatus.TO_BE_EXPORTED
        );
        if (workRequests.length > 0) {
          const obsWR: Observable<any>[] = [];
          for (const wr of workRequests) {
            const exportWR = this.exportWorkRequest(wr);
            obsWR.push(exportWR);
          }
          forkJoin(obsWR).subscribe(() => {
            console.log('Work Requests exported');
            observer.next();
            observer.complete();
          });
        } else {
          console.log('No Work Requests to export');
          observer.next();
          observer.complete();
        }
      });
    });
    return observable;
  }

  exportWorkRequest(workRequest: WorkRequest): Observable<any> {
    this.loadingService.show({
      message: Msg.MSG_EXPORT_WORK_REQUEST,
    });
    return this.http
      .post<WorkRequest>(`${this.URL}/`, workRequest, this.httpHeader)
      .pipe(
        tap(() => {
          workRequest.SYNC = SyncStatus.EXPORTED;
          this.dataManager
            .updateWorkRequest(workRequest)
            .subscribe((wr) => this.loadingService.hide());
        }),
        catchError(this.handleError<WorkRequest>('Add Work Request'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.loadingService.hide();
      this.toastService.showError(error.message);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
