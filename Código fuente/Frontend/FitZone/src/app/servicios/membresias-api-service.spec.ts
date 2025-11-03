import { TestBed } from '@angular/core/testing';

import { MembresiasApiService } from './membresias-api-service';

describe('MembresiasApiService', () => {
  let service: MembresiasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembresiasApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
