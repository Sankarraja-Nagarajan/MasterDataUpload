import { Component,OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed *ngIf="isLogin">
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive *ngIf="isLogin">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed *ngIf="isLogin">
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent implements OnInit {
  isLogin:boolean =true
  selectedMenu;
  constructor(private _router:Router,private _menuService : NbMenuService){}
  ngOnInit(): void {
    this._router.events.subscribe({
      next:(res)=>{
        if(res instanceof NavigationEnd)
        {
          if(res.url.includes("login"))
          {
            this.isLogin=false;
          }
        }
      }
    });
  }
  itemSelected(){
    this._menuService.getSelectedItem('menu-sidebar').subscribe((data) => {
      console.log(data?.item.title);
    })
  }
}
