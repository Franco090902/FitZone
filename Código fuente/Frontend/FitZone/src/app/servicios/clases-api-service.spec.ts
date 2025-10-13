import { TestBed } from '@angular/core/testing';

import { ClasesApiService } from './clases-api-service';

describe('ClasesApiService', () => {
  let service: ClasesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
