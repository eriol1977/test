import { ComponentFixture, TestBed } from '@angular/core/testing';
import { REQApprovalPage } from './reqapproval.page';

describe('REQApprovalPage', () => {
  let component: REQApprovalPage;
  let fixture: ComponentFixture<REQApprovalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(REQApprovalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
