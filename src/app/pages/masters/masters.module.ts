import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataUploadComponent } from './master-data-upload/master-data-upload.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

const routes : Routes = [
  {
    path : '',
    redirectTo : 'workflows',
    pathMatch : 'full'
  },
  {
    path : 'workflows',
    component : MasterDataUploadComponent
  }
]

@NgModule({
  declarations: [
    MasterDataUploadComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule.forChild(routes)
  ]
})
export class MastersModule { }
