import { TestBed } from '@angular/core/testing';

import { TrainersApiService } from './trainers-api-service';

describe('TrainersApiService', () => {
  let service: TrainersApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainersApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
