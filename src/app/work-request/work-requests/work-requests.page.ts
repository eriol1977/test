import { Component, OnInit } from '@angular/core';
import { DataManager } from 'src/app/core/datamanager/data-manager';
import { LoaderService } from '../../core/services/loader.service';
import { Observable } from 'rxjs';
import { Status, WorkRequest, WorkRequestItem } from 'src/app/common/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-requests',
  templateUrl: './work-requests.page.html',
  styleUrls: ['./work-requests.page.scss'],
})
export class WorkRequestsPage implements OnInit {
  loading: boolean = false;

  workRequests: WorkRequestItem[] = [];

  constructor(
    private loadingService: LoaderService,
    private dataManager: DataManager,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.startLoading();
  }

  ionViewWillEnter() {
    if (!this.loading) this.startLoading();
    this.loading = false;
  }

  private startLoading(): void {
    this.loadingService
      .show({
        message: 'Loading...',
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
      this.workRequests = [];
      this.dataManager.getWorkRequests().subscribe((list) => {
        let wrList: WorkRequest[] = list;
        wrList.forEach((wr) => {
          let wrItem: WorkRequestItem = {
            IDLIST: wr.IDLIST,
            WOREDESCR: wr.WOREDESCR,
            COLOR: wr.WORESTATCODE === Status.DRAFT ? 'warning' : '',
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
    this.router.navigate(['/work-request/edit-work-request', IDLIST]);
  }

  goBack(): void {
    this.router.navigate(['/landing']);
  }
}
