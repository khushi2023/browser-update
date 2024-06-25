import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RelaunchChromeService } from './relaunch-chrome.service';
import { provideHttpClient} from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),NgbActiveModal,RelaunchChromeService, provideHttpClient()]
};
