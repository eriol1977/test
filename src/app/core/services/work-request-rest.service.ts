import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AssetLocation,
  ComponentAsset,
  Personnel,
  Problem,
  WorkRequest,
} from 'src/app/common/models';
import { ToastService } from './toast.service';
import { LoaderService } from './nx-loader.service';
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
        map((locArray) => locArray.filter((loc) => loc.ASLOISMAINT === 'Y')), // filters Maintenance asset locations
        catchError(this.handleError<AssetLocation[]>('Get asset locations', []))
      );
  }

  getComponentsList(): Observable<ComponentAsset[]> {
    return this.http
      .get<ComponentAsset[]>(`${this.URL}/4003`, this.httpHeader)
      .pipe(
        catchError(this.handleError<ComponentAsset[]>('Get components', []))
      );
  }

  getProblemsList(): Observable<Problem[]> {
    return this.http
      .get<Problem[]>(`${this.URL}/4005`, this.httpHeader)
      .pipe(catchError(this.handleError<Problem[]>('Get problems', [])));
  }

  getPersonnelList(): Observable<Personnel[]> {
    return this.http
      .get<Personnel[]>(`${this.URL}/9`, this.httpHeader)
      .pipe(catchError(this.handleError<Personnel[]>('Get personnel', [])));
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
