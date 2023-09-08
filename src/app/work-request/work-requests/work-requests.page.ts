import { Component, OnInit } from '@angular/core';
import { DataManager } from 'src/app/core/datamanager/data-manager';
import { LoaderService } from '../../core/services/loader.service';
import { Observable } from 'rxjs';
import {
  SyncStatus,
  WorkRequest,
  WorkRequestItem,
} from 'src/app/common/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-requests',
  templateUrl: './work-requests.page.html',
  styleUrls: ['./work-requests.page.scss'],
})
export class WorkRequestsPage implements OnInit {
  workRequests: WorkRequestItem[] = [];

  constructor(
    private loadingService: LoaderService,
    private dataManager: DataManager,
    private router: Router
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
        let wrList: WorkRequest[] = list;
        wrList.forEach((wr) => {
          let wrItem: WorkRequestItem = {
            IDLIST: wr.IDLIST,
            WOREDESCR: wr.WOREDESCR,
            COLOR: wr.SYNC === SyncStatus.TO_BE_EXPORTED ? 'warning' : '',
          };
          this.dataManager
            .getAssetLocation(wr.WOREASLOCODE || '')
            .subscribe((loc) => {
              wrItem.ASLODESCR = loc.ASLODESCR;

              this.dataManager
                .getComponent(wr.WORECOGRCODE || '', wr.WORECLASCODE || '')
                .subscribe((comp) => {
                  wrItem.COGRDESCR = comp.COGRDESCR;

                  this.dataManager
                    .getProblem(wr.WOREPROBCODE || '')
                    .subscribe((prob) => {
                      wrItem.PROBDESCR = prob.PROBDESCR;
                      this.workRequests.push(wrItem);
                    });
                });
            });
        });
        observer.next();
        observer.complete();
      });
    });
    return observable;
  }

  onWorkRequestClicked(IDLIST?: string) {
    alert(IDLIST);
  }
}
