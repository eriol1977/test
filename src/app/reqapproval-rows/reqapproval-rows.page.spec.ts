import { ComponentFixture, TestBed } from '@angular/core/testing';
import { REQApprovalRowsPage } from './reqapproval-rows.page';

describe('REQApprovalRowsPage', () => {
  let component: REQApprovalRowsPage;
  let fixture: ComponentFixture<REQApprovalRowsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(REQApprovalRowsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
