import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../core';
import { Observable } from 'rxjs';
import { REQHeader } from '../common/models';
import { DataManager } from '../core/datamanager/data-manager';

@Component({
  selector: 'app-reqapproval',
  templateUrl: './reqapproval.page.html',
  styleUrls: ['./reqapproval.page.scss'],
})
export class REQApprovalPage implements OnInit {
  loading: boolean = false;

  reqs: REQHeader[] = [];

  constructor(
    private loadingService: LoaderService,
    private router: Router,
    private dataManager: DataManager
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
      this.reqs = [];
      this.dataManager.getREQHeadersList().subscribe((list) => {
        this.reqs = list;
      });
      observer.next();
      observer.complete();
    });
    return observable;
  }

  onREQClicked(id: string) {
    this.router.navigate(['/reqapproval-rows', id]);
  }

  goBack(): void {
    this.router.navigate(['/landing']);
  }
}
