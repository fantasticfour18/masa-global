import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonTabs } from '@ionic/angular';

import { Subject } from 'rxjs';
import { filter, takeUntil, finalize } from 'rxjs/operators';
import { ApiService } from '../services/api/api.service';
import { MemberModel } from '../models/member.model';
import { MemberCardService } from '../services/member-card/member-card.service';
import { Plugins } from '@capacitor/core';

const { Device } = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
  @ViewChild(IonTabs, { static: true }) tabs: IonTabs;

  member: MemberModel;

  isChildPage: boolean;
  deviceInfo: any = null;

  private alive: Subject<any> = new Subject();

  private readonly parentPages = [
    'benefits',
    'profile',
    'claims',
    'notes',
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private memberCardService: MemberCardService
  ) {
    this.router.events
      .pipe(
        takeUntil(this.alive),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(
        (event: NavigationEnd) => {
          const urlParts = event.url.split('/');
          const parentPage = urlParts[urlParts.length - 2];

          if (this.parentPages.includes(parentPage)) {
            this.isChildPage = true;
          } else {
            this.isChildPage = false;
          }
        },
      );
  }

  ngOnInit() {
    this.getDeviceInfo();
    this.getData();
  }

  ngOnDestroy() {
    this.alive.next();
    this.alive.complete();
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
  }

  getData() {
    this.apiService.getMemberInformation()
      .pipe(
        takeUntil(this.alive),
      )
      .subscribe(
        (memberResponse: any) => {
          this.member = new MemberModel(memberResponse);
          //this.getDocuments();
        },
        (_error: any) => {
          this.member = null;
          this.apiService.addLogs('Home', _error, this.deviceInfo);
        },
      );
  }

  // Check Documents for Menu Enable/Disable
  /* getDocuments()
  {
    this.apiService.getDocuments(this.member.id).subscribe(data => {
      if(!data.length) {
        this.memberCardService.setViewMSAMenu(true);
      }
      else {
        this.memberCardService.setViewMSAMenu(true);
      }
    }, (err) => {
      alert(JSON.stringify(err)); 
    });
  } */

  handleTabClick(event: MouseEvent) {
    const { tab } = event.composedPath().find((element: any) => element.tagName === 'ION-TAB-BUTTON') as EventTarget & { tab: string };

    if (this.tabs.outlet.canGoBack(1, tab)) {
      event.stopImmediatePropagation();

      return this.tabs.outlet.pop(1, tab);
    }
  }
}
