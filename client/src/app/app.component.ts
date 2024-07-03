import { Component, NgModule, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { detect } from 'detect-browser';
import { ModalBoxComponent } from './modal-box/modal-box.component';
import { HttpClientModule } from '@angular/common/http';
import { RelaunchChromeService } from './relaunch-chrome.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, ModalBoxComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  machineVersion: any;
  intervalId: any;
  title = 'browser-update';
  flag: any;
  constructor(public modalService: NgbModal, private relaunchService: RelaunchChromeService) { }
  ngOnInit(): void {
    this.checkChromeVersion();
    this.startInterval();
  }
  startInterval() {
    this.intervalId = setInterval(() => {
      //to check if flag is true and if component is not open
      if (!this.modalService.hasOpenModals() && this.flag) {
        this.checkChromeVersion();
      }
    }, 4000);
  }

  stopInterval() {
    console.log(this.intervalId);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async checkChromeVersion() {
    const browser = detect();
    console.log(browser);

    if (browser && browser.name === 'chrome') {
      const currentVersion = parseInt(browser.version);
      console.log(currentVersion);
      console.log(browser.os);
      let url = `https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=${browser.os}&num=1`;
      console.log(url);
      try {
        const response = await fetch(url, { mode: "cors" });
        const res = await response.json();
        const latestVersion = parseInt(res[0].version.split('.')[0]);
        console.log(latestVersion);
        //service call for machine version
        this.relaunchService.chromeRelaunch().subscribe((res) => {
          console.log(res.version.split('.'));
          this.machineVersion = res;
          console.log(this.machineVersion);
          if ((this.machineVersion.version.split('.')[0] < latestVersion) || (currentVersion <= latestVersion)) {
            this.showDownloadDialog();
          }
          if (currentVersion != this.machineVersion.version.split('.')[0] || (currentVersion < this.machineVersion.version.split('.')[0])) {
            this.showRelaunchDialog();
          }
        },
          (error) => {
            console.error('Error relaunching Chrome:', error);
          })
      } catch (err) {
        console.log(err);
      }
    }
  }
  showDownloadDialog() {
    this.stopInterval(); // Stop the interval when showing the popup

    let modalRef = this.modalService.open(ModalBoxComponent, { centered: false, backdrop: 'static', windowClass: 'suggestion-bar-modal' });
    
    //bind isUpdate property and flag-> for showing popup
    modalRef.componentInstance.isUpdate = true;
 
    //flag-> true popup will appear
    //flag-> false popup will not appear
  
    modalRef.componentInstance.flagChange.subscribe((updatedFlag: boolean) => {
      this.flag = updatedFlag; // Update the flag in the parent component
      console.log('Check Update flag in AppComponent:', this.flag);
    });

    // modalRef.result.then((result)=>{
    //   // if(result){
    //   //   this.flag = result
    //   // }
    //   // console.log(this.flag);
    //   console.log(result);
      
    // })

    modalRef.result.then(
      () => this.startInterval(), // Restart the interval after the popup is closed
      () => this.startInterval()  // Restart the interval if the popup is dismissed
    );
  }

  showRelaunchDialog() {
    this.stopInterval(); // Stop the interval when showing the popup

    const modalRef = this.modalService.open(ModalBoxComponent, { centered: false, windowClass: 'suggestion-bar-modal' });
    modalRef.componentInstance.isUpdate = false;

    modalRef.result.then(
      () => this.startInterval() // Restart the interval after the popup is close  // Restart the interval if the popup is dismissed
    );
  }
}
