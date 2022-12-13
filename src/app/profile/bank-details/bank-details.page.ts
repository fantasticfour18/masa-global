import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MemberModel } from 'src/app/models/member.model';
import { ApiService } from 'src/app/services/api/api.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { Plugins } from '@capacitor/core';
import { AddressPost, PaymentCard, PaymentCardResp, PaymentEcheck } from 'src/app/models/payment.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastrService } from 'src/app/services/toastr/toasts.service';

const { Device } = Plugins;

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.page.html',
  styleUrls: ['../../auth/shared/styles.scss', './bank-details.page.scss']
})
export class BankDetailsPage implements OnInit {

  memberId: number;
  updateCardOrAch: any = "card";
  cardDetails: FormGroup;
  addressDetails: FormGroup;
  deviceInfo: any = null;
  paymentCard: PaymentCardResp;
  isCardUpdating: boolean;
  isAddressUpdating: boolean;
  allowFocus: boolean = true;

  constructor(private apiService: ApiService, private errorHandler: ErrorHandlerService, private toastService: ToastrService,
              private route: ActivatedRoute, private router: Router, private loader: LoadingController) 
  {  
    this.route.queryParams.subscribe(param => {
      if(this.router.getCurrentNavigation().extras.state) 
      {
        this.memberId = router.getCurrentNavigation().extras.state.memberId;
        console.log(this.memberId);
        this.getCardDetails(this.memberId);
      }
    })
  }

  ngOnInit() 
  { 
    this.getDeviceInfo();

    this.cardDetails = new FormGroup({
      cardType: new FormControl(null, [Validators.required]),
      nameOnCard: new FormControl(null, [Validators.required]),
      accountNumber: new FormControl(null, [Validators.required]),
      expireMonth: new FormControl(null, [Validators.required]),
      expireYear: new FormControl(null, [Validators.required]),
      cardVerificationValue: new FormControl(null),

      accountHolder: new FormControl(null, [Validators.required]),
      raccountNumber: new FormControl(null, [Validators.required]),
      accountType: new FormControl("savings", [Validators.required]),
      routingNumber: new FormControl(null, [Validators.required]),
    });

    this.addressDetails = new FormGroup({
      email: new FormControl(null, [Validators.email]),
      phone: new FormControl(null),
      address: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zip: new FormControl(null, [Validators.required])
    });
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  setUpdateType(event: any)
  {
    console.log(event.target.value);
    this.updateCardOrAch = event.target.value;
  }

  async getCardDetails(memberId: number)
  {
    const loaderCtrl = await this.loader.create({
      message: "Please wait",
      backdropDismiss: false  
    });

    await loaderCtrl.present();
    
    this.apiService.getCardDetails(memberId).subscribe((resp: PaymentCardResp) => {
      loaderCtrl.dismiss();      
      console.log(resp);
      this.paymentCard = resp;
    });
  }

  setExpireDate(event: any)
  {
    if(event.target.value.length == 1 && event.target.value > 1) {
      this.cardDetails.patchValue({expireMonth: "0" + event.target.value});  
    }
    else if(event.target.value.includes(' ')) {
      this.cardDetails.patchValue({expireMonth: event.target.value.trim()});
    }
  }

  updateAddressDetails()
  {
    this.isAddressUpdating = true;

    let addressPost: AddressPost = {
      customerId: this.memberId + "",
      customerToken: this.paymentCard.customerToken,
      addressToken: this.paymentCard.defaultBillingAddressToken,
      addressType: this.paymentCard.defaultBillingAddress.addressType,
      firstName: this.paymentCard.firstName,
      lastName: this.paymentCard.lastName,
      email: this.addressDetails.get("email").value,
      phone: this.addressDetails.get("phone").value,
      physicalAddress: {
        streetLine1: this.addressDetails.get("address").value,
        locality: this.addressDetails.get("city").value,
        region: this.addressDetails.get("state").value,
        postalCode: this.addressDetails.get("zip").value
      },
      shippingAddressType: this.paymentCard.defaultBillingAddress.shippingAddressType
    }
    
    this.apiService.updateAddressDetails(addressPost).subscribe(resp => {
      this.isAddressUpdating = false;
      this.showToast("Address details updated successfully", "success");
      console.log(resp);
    },
    (err) => {
      this.isAddressUpdating = false;
      this.showToast("Unable to update address details", "danger");
      console.error(err);
    })
  }

  updateCardDetails()
  {
    this.isCardUpdating = true;
    let payLoad;

    //  Format Card Details
    if(this.updateCardOrAch == 'card')
    {
      let cardData: PaymentCard = {
        customerId: this.memberId + "",
        customerToken: this.paymentCard.customerToken,
        paymethodToken: this.paymentCard.defaultPaymethodToken,
        paymethodType: this.updateCardOrAch,
        card: { 
          nameOnCard: null,
          expireMonth: null,
          expireYear: null,
          cardVerificationValue: null,
          cardType: "visa"
        }
      }

      if(this.cardDetails.get("nameOnCard").value && this.cardDetails.get("nameOnCard").value.length) {
        cardData.card.nameOnCard = this.cardDetails.get("nameOnCard").value;
      }
  
      if(this.cardDetails.get("accountNumber").value && this.cardDetails.get("accountNumber").value.length) {
        cardData.card.accountNumber = this.cardDetails.get("accountNumber").value;
      }
  
      if(this.cardDetails.get("expireMonth").value && this.cardDetails.get("expireMonth").value.length) {
        cardData.card.expireMonth = this.cardDetails.get("expireMonth").value;
      }
  
      if(this.cardDetails.get("expireYear").value && this.cardDetails.get("expireYear").value.length) {
        cardData.card.expireYear = this.cardDetails.get("expireYear").value;
      }
  
      if(this.cardDetails.get("cardVerificationValue").value && this.cardDetails.get("cardVerificationValue").value.length) {
        cardData.card.cardVerificationValue = this.cardDetails.get("cardVerificationValue").value;
      }

      payLoad = cardData;
    }
    //  Format Echeck Details
    else
    {
      let cardData: PaymentEcheck = {
        customerId: this.memberId + "",
        customerToken: this.paymentCard.customerToken,
        paymethodToken: this.paymentCard.defaultPaymethodToken,
        paymethodType: this.updateCardOrAch,
        echeck: { 
          accountHolder: this.cardDetails.get("accountHolder").value,
          accountNumber: this.cardDetails.get("raccountNumber").value,
          accountType: this.cardDetails.get("accountType").value,
          routingNumber: this.cardDetails.get("routingNumber").value
        }
      }

      payLoad = cardData
    } 

    this.apiService.updateCardDetails(payLoad).subscribe(resp => {
      this.isCardUpdating = false;
      this.showToast("Payment details updated successfully", "success");
      this.router.navigate(['/tabs/profile/bank-card']);
      console.log(resp);
    },
    (err) => {
      this.isCardUpdating = false;
      if(err.error.response && err.error.response.response_desc) {
        this.showToast(err.error.response.response_desc, "danger");
      }
      else {
        this.showToast("Unable to update payment details", "danger");
      }
      
      console.error(err);
    })
  }

  showToast(message, color)
  {
    this.toastService.create({
      message: message,
      color: color,
      duration: 3000
    });
  }

  trimFormValue(event, controlName: string) {
    this.addressDetails.get(controlName).patchValue(event.target.value.trimStart().replace(/\s\s+/g, ' '));
  }

  trimCardForm(event, controlName: string) {
    this.cardDetails.get(controlName).patchValue(event.target.value.trimStart().replace(/\s\s+/g, ' '));
  }

  trimCardNumeric(event, controlName: string) 
  {
    if(event.target.value.length > 0 && event.target.value == ' ') {
      this.allowFocus = false;
    }
    else {
      this.allowFocus = true;
    }

    this.cardDetails.get(controlName).patchValue(event.target.value.replace(/\s/g, ''));
  }

  trimPhone(event) {
    this.addressDetails.get('phone').patchValue(event.target.value.replace(/[., ]+/g, ''));
  }

}
