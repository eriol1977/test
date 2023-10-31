import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentStatus, REQRow } from '../common/models';
import { LoaderService } from '../core';
import { Observable } from 'rxjs';
import { DataManager } from '../core/datamanager/data-manager';

@Component({
  selector: 'app-reqapproval-rows',
  templateUrl: './reqapproval-rows.page.html',
  styleUrls: ['./reqapproval-rows.page.scss'],
})
export class REQApprovalRowsPage implements OnInit {
  reqId: string = '';
  loading: boolean = false;
  rows: REQRow[] = [];
  statusList: DocumentStatus[] = [];

  constructor(
    private loadingService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private dataManager: DataManager
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.reqId = params['id'];
      this.loading = true;
      this.startLoading();
    });
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
      this.rows = [];
      this.dataManager.getREQRowsList().subscribe((list) => {
        this.rows = list.filter((r) => r.IDDOC === this.reqId);

        // gets possible statuses
        this.statusList = [];
        this.dataManager.getREQHeader(this.reqId).subscribe((req) => {
          let nextStatuses: string[] = req.NEXTSTATUSES.split(';');
          for (let nextStatus of nextStatuses) {
            if (nextStatus.trim() !== '') {
              let parts: string[] = nextStatus.split('#');
              this.statusList.push({
                code: parts[0],
                description: parts[1],
                isCancelled: parts[2] === 'N' ? false : true,
              });
            }
          }
          observer.next();
          observer.complete();
        });
      });
    });
    return observable;
  }

  changeStatus(statusCode: string) {
    alert(`Change status to ${statusCode}`);
  }

  goBack(): void {
    this.router.navigate(['/reqapproval']);
  }
}
