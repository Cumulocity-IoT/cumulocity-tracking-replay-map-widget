import { TestBed } from '@angular/core/testing';

import { GpTrackingReplayMapService } from './gp-tracking-replay-map.service';

describe('GpTrackingReplayMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GpTrackingReplayMapService = TestBed.get(GpTrackingReplayMapService);
    expect(service).toBeTruthy();
  });
});
