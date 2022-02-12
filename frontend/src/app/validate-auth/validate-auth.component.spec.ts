import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateAuthComponent } from './validate-auth.component';

describe('ValidateAuthComponent', () => {
  let component: ValidateAuthComponent;
  let fixture: ComponentFixture<ValidateAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
