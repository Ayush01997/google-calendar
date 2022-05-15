import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateTeamAuthComponent } from './validate-team-auth.component';

describe('ValidateTeamAuthComponent', () => {
  let component: ValidateTeamAuthComponent;
  let fixture: ComponentFixture<ValidateTeamAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateTeamAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateTeamAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
