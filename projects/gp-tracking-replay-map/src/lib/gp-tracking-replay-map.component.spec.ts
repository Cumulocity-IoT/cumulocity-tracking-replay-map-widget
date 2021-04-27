import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpTrackingReplayMapComponent } from './gp-tracking-replay-map.component';

describe('GpTrackingReplayMapComponent', () => {
  let component: GpTrackingReplayMapComponent;
  let fixture: ComponentFixture<GpTrackingReplayMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpTrackingReplayMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpTrackingReplayMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
