import { TestBed } from '@angular/core/testing';

import { ReservasApiService } from './reservas-api-service';

describe('ReservasApiService', () => {
  let service: ReservasApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservasApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
