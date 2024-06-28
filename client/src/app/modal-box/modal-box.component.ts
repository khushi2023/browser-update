import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RelaunchChromeService } from '../relaunch-chrome.service';
// import open from 'open';
// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-modal-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-box.component.html',
  styleUrl: './modal-box.component.css'
})
export class ModalBoxComponent {
  @Input() isUpdate: boolean = true;
  requestToRelaunch:boolean = false;
  message:any;
  constructor(public activeModal: NgbActiveModal, private relaunchService:RelaunchChromeService) {}

  openRelaunch(){
   this.relaunchService.sendRelaunchRequest().subscribe((res)=>{
    if(res){
      this.activeModal.close();
    }
   })
  }

  //when clicked on update button
  updateModal(){
    window.open('https://www.google.com/chrome/', '_blank');
    this.activeModal.close()
  }
}