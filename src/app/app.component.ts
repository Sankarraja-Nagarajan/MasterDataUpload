/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { Router } from '@angular/router';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { MasterTableInfoService } from './Services/master-table-info.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-app',
  template: `<ngx-one-column-layout>
  <nb-menu tag="menu" [items]="menu"></nb-menu>
  <router-outlet></router-outlet>
 </ngx-one-column-layout>`,
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  subHeader: string = '';
  constructor(private analytics: AnalyticsService,
    private seoService: SeoService,
    private _route: Router,
    private menuService: NbMenuService,
    private _masterTableInfoService: MasterTableInfoService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }

  menu: NbMenuItem[] = [
    {
      title: 'WORK FLOWS',
      group: true,
    },
    {
      title: "TCI",
      link: '/master-data-upload/workflows',
      icon: 'layout-outline',
    },
    {
      title: "RCR",
      link: '/master-data-upload/workflows', icon: 'layout-outline',
    },
    {
      title: "VendorAdvance",
      link: '/master-data-upload/workflows', icon: 'layout-outline',
    },
    {
      title: "FOC",
      link: '/master-data-upload/workflows', icon: 'layout-outline',
    },
    {
      title: "SalesPrice",
      link: '/master-data-upload/workflows', icon: 'layout-outline',
    }
  ];

}