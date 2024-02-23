import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MasterTableInfoService } from '../../../Services/master-table-info.service';
import { ActivatedRoute } from '@angular/router';

export interface tableType {
  position : number,
  name : string,
  weight : number,
  symbol : string
}
@Component({
  selector: 'ngx-master-data-upload',
  templateUrl: './master-data-upload.component.html',
  styleUrls: ['./master-data-upload.component.scss']
})
export class MasterDataUploadComponent implements OnInit{

  tableNames = ['Bsak','Ekko','asdf','heih','Ekko','User Credentials','User','e4rw','asdf','cvsa','wrsf','adfa','nhhc','cksr','cswn','cner']
  // tableNames =['Bsak','Ekko']
  dataSource : any = [
    {
      ID:2,
      PO_Number : 12412312312,
      Price : 2424,
      Currency : 'INR'
    },
    {
      ID:2,
      PO_Number : 12412312312,
      Price : 2424,
      Currency : 'INR'
    },
    {
      ID:2,
      PO_Number : 12412312312,
      Price : 2424,
      Currency : 'INR'
    },
    {
      ID:2,
      PO_Number : 12412312312,
      Price : 2424,
      Currency : 'INR'
    },
    {
      ID:2,
      PO_Number : 12412312312,
      Price : 2424,
      Currency : 'INR'
    },
    {
      ID:2,
      PO_Number : 12412312312,
      Price : 2424,
      Currency : 'INR'
    },

    {
      ID:2,
      PO_Number : 12412312312,
      Price : 2424,
      Currency : 'INR'
    },
    
  ];
  title : string;
  displayedColumns : string[];
  constructor(private _masterTableInfoService : MasterTableInfoService,
    private _activatedRoute : ActivatedRoute){
    this.title = 'TCI';
    this.displayedColumns = _masterTableInfoService.tableInfo[this.title]['displayedColumns']
  }

  ngOnInit(){
    this._activatedRoute.queryParams.subscribe({
      next:(data)=>{
        if(data.name){
           this.title = data.name;
           this.displayedColumns = this._masterTableInfoService.tableInfo[data.name]['displayedColumns'];
           console.log(this.displayedColumns)
        }
        else console.log("Bsak");
      }
    })
  }
 
  
}
