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
      ops.push(this.importAll());
      forkJoin(ops).subscribe(() => {
        console.log('Synchronization completed');
        observer.next();
        observer.complete();
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
          // writes all the imported data to the data store before proceeding
          const setOps: Observable<any>[] = [];
          setOps.push(this.dataManager.setAssetLocationList(assetLocationData));
          setOps.push(
            this.dataManager.setClassificationsList(classificationData)
          );
          setOps.push(this.dataManager.setComponentsList(componentsData));
          setOps.push(
            this.dataManager.setComponentProblemsList(compProblemsData)
          );
          setOps.push(this.dataManager.setProblemsList(problemsData));
          setOps.push(this.dataManager.setPersonnelList(personnelData));
          forkJoin(setOps).subscribe(() => {
            console.log('Import completed');
            observer.next();
            observer.complete();
          });
        }
      );
    });
    return observable;
  }

  importAssetLocationList(): Observable<AssetLocation[]> {
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
        tap((array) => console.log(`${array.length} Asset Locations imported`)),
        catchError(this.handleError<AssetLocation[]>('Get asset locations', []))
      );
  }

  importClassificationsList(): Observable<Classification[]> {
    return this.http
      .get<Classification[]>(`${this.URL}/4001`, this.httpHeader)
      .pipe(
        tap((array) => console.log(`${array.length} Classifications imported`)),
        catchError(
          this.handleError<Classification[]>('Get classifications', [])
        )
      );
  }

  importComponentsList(): Observable<ComponentAsset[]> {
    return this.http
      .get<ComponentAsset[]>(`${this.URL}/4003`, this.httpHeader)
      .pipe(
        map((compArray) =>
          compArray.sort((comp1, comp2) =>
            (comp1.COGRDESCR || '') > (comp2.COGRDESCR || '') ? 1 : -1
          )
        ), //orders by description
        tap((array) => console.log(`${array.length} Components imported`)),
        catchError(this.handleError<ComponentAsset[]>('Get components', []))
      );
  }

  importComponentProblemsList(): Observable<ComponentProblem[]> {
    return this.http
      .get<ComponentProblem[]>(`${this.URL}/4005`, this.httpHeader)
      .pipe(
        tap((array) =>
          console.log(`${array.length} Component Problems imported`)
        ),
        catchError(
          this.handleError<ComponentProblem[]>('Get component problems', [])
        )
      );
  }

  importProblemsList(): Observable<Problem[]> {
    return this.http.get<Problem[]>(`${this.URL}/4004`, this.httpHeader).pipe(
      map((probArray) =>
        probArray.filter(
          (prob) => prob.CANCELLED !== 'X' && prob.PROBISSYMPTOM?.trim() === 'Y'
        )
      ), // filters active and is symptom
      tap((array) => console.log(`${array.length} Problems imported`)),
      catchError(this.handleError<Problem[]>('Get problems', []))
    );
  }

  importPersonnelList(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(`${this.URL}/9`, this.httpHeader).pipe(
      map((persArray) =>
        persArray.sort((pers1, pers2) =>
          (pers1.PERSONNAME || '') > (pers2.PERSONNAME || '') ? 1 : -1
        )
      ), //orders by name
      tap((array) => console.log(`${array.length} Personnel imported`)),
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
    return this.http
      .post<WorkRequest>(`${this.URL}/`, workRequest, this.httpHeader)
      .pipe(catchError(this.handleError<WorkRequest>('Add Work Request')));
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
