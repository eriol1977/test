import { Component, OnInit } from '@angular/core';
import { DataManager } from 'src/app/core/datamanager/data-manager';
import { LoaderService } from '../../core/services/loader.service';
import { Observable } from 'rxjs';
import { WorkRequest } from 'src/app/common/models';

@Component({
  selector: 'app-work-requests',
  templateUrl: './work-requests.page.html',
  styleUrls: ['./work-requests.page.scss'],
})
export class WorkRequestsPage implements OnInit {
  workRequests: WorkRequest[] = [];

  constructor(
    private loadingService: LoaderService,
    private dataManager: DataManager
  ) {}

  ngOnInit() {
    this.loadingService
      .show({
        message: 'Initializing...',
      })
      .then(() => {
        // waits for the loading message component to be ready, before proceeding

        this.initData().subscribe(() => {
          this.loadingService.hide();
        });
      });
  }

  private initData(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.dataManager.getWorkRequests().subscribe((list) => {
        this.workRequests = list;
        observer.next();
        observer.complete();
      });
    });
    return observable;
  }
}
