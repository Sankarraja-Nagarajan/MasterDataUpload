import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MasterTableInfoService } from '../../../Services/master-table-info.service';
import { ActivatedRoute } from '@angular/router';
import { NbMenuService } from '@nebular/theme';

export interface tableType {
  position: number,
  name: string,
  weight: number,
  symbol: string
}
@Component({
  selector: 'ngx-master-data-upload',
  templateUrl: './master-data-upload.component.html',
  styleUrls: ['./master-data-upload.component.scss']
})
export class MasterDataUploadComponent implements OnInit {

  tableNames = ['Ekko', 'Bsak', 'heih', 'User Credentials', 'User', 'e4rw', 'asdf', 'cvsa', 'wrsf', 'adfa', 'nhhc', 'cksr', 'cswn', 'cner']
  selectedTable: string = this.tableNames[0];
  workFlowTable: string = 'TCI';
  dataSource: any = [
    {
      ID: 2,
      PO_Number: 12412312312,
      Price: 2424,
      Currency: 'INR'
    },
    {
      ID: 2,
      PO_Number: 12412312312,
      Price: 2424,
      Currency: 'INR'
    },
    {
      ID: 2,
      PO_Number: 12412312312,
      Price: 2424,
      Currency: 'INR'
    },
    {
      ID: 2,
      PO_Number: 12412312312,
      Price: 2424,
      Currency: 'INR'
    },
    {
      ID: 2,
      PO_Number: 12412312312,
      Price: 2424,
      Currency: 'INR'
    },
    {
      ID: 2,
      PO_Number: 12412312312,
      Price: 2424,
      Currency: 'INR'
    },

    {
      ID: 2,
      PO_Number: 12412312312,
      Price: 2424,
      Currency: 'INR'
    },

  ];
  title: string;
  displayedColumns: string[];
  constructor(private _masterTableInfoService: MasterTableInfoService,
    private _nbMenu: NbMenuService,
    private _activatedRoute: ActivatedRoute) {
    this.title = _masterTableInfoService.tableName;
    this.displayedColumns = _masterTableInfoService.tableInfo[this.title]['displayedColumns']

    _nbMenu.onItemClick().subscribe(x => {
      if (x != null) {
        if (x.item.title != 'TCI') {
          this.workFlowTable = x.item.title;
          _masterTableInfoService.tableName = this.workFlowTable;
          this.selectedTable = this.tableNames[0]
          this.displayedColumns = _masterTableInfoService.tableInfo[this.workFlowTable]['displayedColumns']

          _nbMenu.onItemSelect().subscribe(x => {
            x.item.selected = false;
          })
        }
        else this.workFlowTable = 'TCI';
        this.selectedTable = this.tableNames[0];
      }
    })
  }

  ngOnInit() {

  }

}