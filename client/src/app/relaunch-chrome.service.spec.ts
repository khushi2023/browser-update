import { TestBed } from '@angular/core/testing';

import { RelaunchChromeService } from './relaunch-chrome.service';

describe('RelaunchChromeService', () => {
  let service: RelaunchChromeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelaunchChromeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
