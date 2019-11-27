import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessSignupComponent } from './success-signup.component';

describe('SuccessSignupComponent', () => {
  let component: SuccessSignupComponent;
  let fixture: ComponentFixture<SuccessSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
