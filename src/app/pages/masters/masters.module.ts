import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataUploadComponent } from './master-data-upload/master-data-upload.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';



const routes: Routes = [
  {
    path: 'workflows',
    component: MasterDataUploadComponent
  }
]

@NgModule({
  declarations: [
    MasterDataUploadComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule.forChild(routes),
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class MastersModule { }
