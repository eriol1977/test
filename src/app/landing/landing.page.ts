import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  goToNewWorkRequest(): void {
    this.router.navigate(['/work-request/new-work-request']);
  }

  goToWorkRequests(): void {
    this.router.navigate(['/work-request/work-requests']);
  }

  goToDBTester(): void {
    this.router.navigate(['/dbtester']);
  }

  goToWSTester(): void {
    this.router.navigate(['/wstester']);
  }
}
