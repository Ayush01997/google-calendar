import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupEventComponent } from './setup-event.component';

describe('SetupEventComponent', () => {
  let component: SetupEventComponent;
  let fixture: ComponentFixture<SetupEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
