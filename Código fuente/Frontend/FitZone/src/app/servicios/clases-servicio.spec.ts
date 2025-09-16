import { TestBed } from '@angular/core/testing';

import { ClasesServicio } from './clases-servicio';

describe('ClasesServicio', () => {
  let service: ClasesServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasesServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
