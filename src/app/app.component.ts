import { Component } from '@angular/core';
import { AppPage } from './common/models';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: AppPage[] = [];
  public menuType: string = 'overlay';

  constructor() {
    this.appPages.push({
      title: 'Home',
      url: '/landing',
      icon: 'home',
    });

    if (environment.maintenanceModuleActive) {
      this.appPages.push({
        title: 'New Work Request',
        url: '/work-request/new-work-request',
        icon: 'build',
      });
      this.appPages.push({
        title: 'Work Requests',
        url: '/work-request/work-requests',
        icon: 'list',
      });
    }

    if (environment.purchaseModuleActive) {
      this.appPages.push({
        title: 'REQ Approval',
        url: '/reqapproval',
        icon: 'card',
      });
    }

    if (environment.isDevelopmentVersion) {
      this.appPages.push({
        title: 'DB Tester',
        url: '/dbtester',
        icon: 'file-tray-stacked',
      });
      this.appPages.push({
        title: 'WS Tester',
        url: '/wstester',
        icon: 'earth',
      });
    }
  }
}
