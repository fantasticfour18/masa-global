import { Component, OnInit } from '@angular/core';
import { MemberModel } from 'src/app/models/member.model';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorHandlerService } from 'src/app/services/error-handler/error-handler.service';
import { Plugins } from '@capacitor/core';
import { PaymentCardResp } from 'src/app/models/payment.model';
import { NavigationExtras, Router } from '@angular/router';

const { Device } = Plugins;

@Component({
  selector: 'app-bank-card',
  templateUrl: './bank-card.page.html',
  styleUrls: ['./bank-card.page.scss'],
})
export class BankCardPage implements OnInit {

  deviceInfo: any = null;
  member: MemberModel;
  paymentCard: PaymentCardResp;
  cardNotFound: string = null;

  constructor(private apiService: ApiService, private router: Router, private errorHandler: ErrorHandlerService) { }

  ngOnInit() 
  {}

  ionViewDidEnter()
  {
    this.paymentCard = null;
    this.getDeviceInfo();
    if(!this.member) {
      this.getMemberData();
    }
    else {
      this.getCardDetails(this.member.id);
    }
    
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  getMemberData() 
  {
    //this.loading = true;
    this.apiService.getMemberInformation()
      .subscribe(
        (memberResponse: any) => {
          //this.loading = false;
          this.member = new MemberModel(memberResponse);
          this.getCardDetails(this.member.id);
        },
        async (error: any) => {
          //this.loading = false;
          console.error({ message: error.message });
          await this.errorHandler.handleError({
            color: 'danger',
            message: error.message,
          })
          this.apiService.addLogs('Bank Card', error, this.deviceInfo);
        },
      );
  }

  getCardDetails(memberId: number)
  {
    console.log(memberId);
    
    this.apiService.getCardDetails(memberId).subscribe((resp: PaymentCardResp) => {
      console.log(resp);
      this.paymentCard = resp;
    },
    (err) => {
      if(err.error == "Customer details not found") {
        this.cardNotFound = "You don't have any card registered"
      }
    });
  }

  navToBankDetails()
  {
    let navExtras: NavigationExtras = {
      state: {
        memberId: this.member.id
      }
    };

    this.router.navigate(['/tabs/profile/bank-details'], navExtras);
  }

}
