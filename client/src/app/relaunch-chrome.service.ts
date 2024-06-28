import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelaunchChromeService {
  private url = "http://localhost:3000"
  // chromeInstalled!:boolean;

  constructor(private http: HttpClient) {}

  //service to check if chrome is installed using get request
  public chromeRelaunch(): Observable<any>{
    return this.http.get<any>(`${this.url}/detect-chrome`).pipe(map((res)=>{
      console.log(res);
      return {installed : res.installed,version: res.version};
      
    }),
  catchError((error)=>{
    console.error(error);
    return of({ installed: false, version: 'Error retrieving version' });
  }));
  }

  //service to send the request to the api using post request
  public sendRelaunchRequest(): Observable<any>{
    return this.http.post<any>(`${this.url}/relaunch-chrome`,{}).pipe(map((res)=>{
      console.log(res);
      return res;
    }),
  catchError((error)=>{
    console.error(error);
    return of(error);
  }));
  }
}