import { Component, NgModule, OnInit, SimpleChange } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { detect } from 'detect-browser';
import { ModalBoxComponent } from './modal-box/modal-box.component';
import { HttpClientModule } from '@angular/common/http';
import { RelaunchChromeService } from './relaunch-chrome.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  machineVersion: any;
  constructor(public modalService: NgbModal, private relaunchService: RelaunchChromeService) { }
  title = 'browser-update';
  ngOnInit(): void {
    this.checkChromeVersion();
  }
  async checkChromeVersion() {
    const browser = detect();
    console.log(browser);

    if (browser && browser.name === 'chrome') {
      const currentVersion = parseInt(browser.version)
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
          if (currentVersion < this.machineVersion.version.split('.')[0]) {
            this.showRelaunchDialog();
          }
          if ((this.machineVersion.version.split('.')[0] < latestVersion) && (currentVersion <= latestVersion)) {
            this.showDownloadDialog();
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
    const modalRef = this.modalService.open(ModalBoxComponent, { centered: false, windowClass: 'suggestion-bar-modal' });
    modalRef.componentInstance.isUpdate = true;
  }

  showRelaunchDialog() {
    const modalRef = this.modalService.open(ModalBoxComponent, { centered: false, windowClass: 'suggestion-bar-modal' });
    modalRef.componentInstance.isUpdate = false;
  }
}
