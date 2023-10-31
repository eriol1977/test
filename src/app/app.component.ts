import { Component } from '@angular/core';
import { AppPage } from './common/models';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: AppPage[] = [
    {
      title: 'Home',
      url: '/landing',
      icon: 'home',
    },
    {
      title: 'New Work Request',
      url: '/work-request/new-work-request',
      icon: 'build',
    },
    {
      title: 'Work Requests',
      url: '/work-request/work-requests',
      icon: 'list',
    },
    {
      title: 'REQ Approval',
      url: '/reqapproval',
      icon: 'card',
    },
    {
      title: 'DB Tester',
      url: '/dbtester',
      icon: 'file-tray-stacked',
    },
    {
      title: 'WS Tester',
      url: '/wstester',
      icon: 'earth',
    },
  ];

  public menuType: string = 'overlay';

  constructor() {}
}
