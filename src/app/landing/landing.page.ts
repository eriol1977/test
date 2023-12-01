import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  public isMaintenance: boolean = environment.maintenanceModuleActive;
  public isPurchase: boolean = environment.purchaseModuleActive;
  public isDevelopment: boolean = environment.isDevelopmentVersion;

  constructor(private router: Router) {}

  ngOnInit() {}

  goToNewWorkRequest(): void {
    this.router.navigate(['/work-request/new-work-request']);
  }

  goToWorkRequests(): void {
    this.router.navigate(['/work-request/work-requests']);
  }

  goToREQApproval(): void {
    this.router.navigate(['/reqapproval']);
  }

  goToDBTester(): void {
    this.router.navigate(['/dbtester']);
  }

  goToWSTester(): void {
    this.router.navigate(['/wstester']);
  }
}
