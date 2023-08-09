import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AssetLocation,
  Classification,
  ComponentAsset,
  Personnel,
  ComponentProblem,
  WorkRequest,
  Problem,
} from 'src/app/common/models';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root',
})
export class WorkRequestRestService {
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
    private loadingService: LoaderService
  ) {}

  getAssetLocationList(): Observable<AssetLocation[]> {
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
        catchError(this.handleError<AssetLocation[]>('Get asset locations', []))
      );
  }

  getClassificationsList(): Observable<Classification[]> {
    return this.http
      .get<Classification[]>(`${this.URL}/4001`, this.httpHeader)
      .pipe(
        catchError(
          this.handleError<Classification[]>('Get classifications', [])
        )
      );
  }

  getComponentsList(): Observable<ComponentAsset[]> {
    return this.http
      .get<ComponentAsset[]>(`${this.URL}/4003`, this.httpHeader)
      .pipe(
        map((compArray) =>
          compArray.sort((comp1, comp2) =>
            (comp1.COGRDESCR || '') > (comp2.COGRDESCR || '') ? 1 : -1
          )
        ), //orders by description
        catchError(this.handleError<ComponentAsset[]>('Get components', []))
      );
  }

  getComponentProblemsList(): Observable<ComponentProblem[]> {
    return this.http
      .get<ComponentProblem[]>(`${this.URL}/4005`, this.httpHeader)
      .pipe(
        catchError(
          this.handleError<ComponentProblem[]>('Get component problems', [])
        )
      );
  }

  getProblemsList(): Observable<Problem[]> {
    return this.http.get<Problem[]>(`${this.URL}/4004`, this.httpHeader).pipe(
      map((probArray) =>
        probArray.filter(
          (prob) => prob.CANCELLED !== 'X' && prob.PROBISSYMPTOM?.trim() === 'Y'
        )
      ), // filters active and is symptom
      catchError(this.handleError<Problem[]>('Get problems', []))
    );
  }

  getPersonnelList(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(`${this.URL}/9`, this.httpHeader).pipe(
      map((persArray) =>
        persArray.sort((pers1, pers2) =>
          (pers1.PERSONNAME || '') > (pers2.PERSONNAME || '') ? 1 : -1
        )
      ), //orders by name
      catchError(this.handleError<Personnel[]>('Get personnel', []))
    );
  }

  addWorkRequest(workRequest: WorkRequest): Observable<any> {
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
