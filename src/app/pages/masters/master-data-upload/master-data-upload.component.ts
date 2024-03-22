import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MasterTableInfoService } from '../../../Services/master-table-info.service';
import { ActivatedRoute } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import { VendorMasterDataService } from '../../../Services/Masters/vendor-master-data.service';
import { CommonSnackBarService } from '../../../Services/common-snack-bar.service';
import { snackbarStatus } from '../../../auth/Enum/enum';
import { SalesMasterDataService } from '../../../Services/Masters/sales-master-data.service';
import { RcrMasterDataService } from '../../../Services/Masters/rcr-master-data.service';
import { TciMasterDataService } from '../../../Services/Masters/tci-master-data.service';
import * as XLSX from 'xlsx';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonSpinnerService } from '../../../Services/common-spinner.service';
import { FileSaverService } from '../../../Services/file-saver.service';
import { FocMasterDataService } from '../../../Services/Masters/foc-master-data.service';

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

  tableNames: any[] = [];
  selectedTable: string;
  workFlowTable: string = '';
  dataSource: any = [];
  displayedColumns: string[];
  notes: any;
  masterTableFormGroup: FormGroup;
  editRow: boolean = false;
  editingRowIndex: number = -1;

  masterTablesFields: any[] = [];
  rcrMatrices = ['UserRoleMaps'];
  showSpinner: boolean = false;

  uploadFile: FormControl = new FormControl('');
  tableColumns: string[];
  editForm: FormGroup;
  lastUpdatedDate: any;
  toolTipData: any;
  approvalMatrix = {
    TCI: 'UserRoleMaps',
    RCR: 'UserRoleMaps',
    VendorAdvance: 'Zfi_T_Wroles',
    FOC: 'FocAgents',
    SalesPrice: 'Zsdcd_t_wfroles'
  }



  constructor(private _vendorMasterService: VendorMasterDataService,
    private _nbMenu: NbMenuService,
    private _activatedRoute: ActivatedRoute,
    private _commonSnackBar: CommonSnackBarService,
    private _salesMasterService: SalesMasterDataService,
    private _rcrMasterService: RcrMasterDataService,
    private _tciMasterService: TciMasterDataService,
    private _focMasterService: FocMasterDataService,
    private _masterService: MasterTableInfoService,
    private _fb: FormBuilder,
    private _commonSpinner: CommonSpinnerService,
    private _fileSaver: FileSaverService) {

    this.masterTableFormGroup = this._fb.group({});

    this.editForm = _fb.group({});

  }


  var = this._masterService.dataSubject.subscribe(x => {
    if (x != null) {
      this.showSpinner = true;
      this.workFlowTable = x;
      localStorage.setItem("WorkflowName", this.workFlowTable);
      this.selectWorkflow(this.workFlowTable);

    }
  })


  ngOnInit() {

  }



  downloadTemplate() {
    if (this.displayedColumns && this.displayedColumns.length > 0) {

      const workSheet = XLSX.utils.aoa_to_sheet([this.displayedColumns]);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
      const fileName = this.selectedTable + `_Master_Data_Template(${this.workFlowTable}).xlsx`;
      XLSX.writeFile(workBook, fileName);

    }
  }

  addFormControls(tableColumns) {
    tableColumns.forEach(x => {
      this.editForm.addControl(x, new FormControl('', [Validators.required]));
    });
  }

  removeAllControls() {
    Object.keys(this.editForm.controls).forEach(key => this.editForm.removeControl(key));
  }

  selectWorkflow(workflowname) {
    switch (workflowname) {
      case "TCI":
        this.workFlowTable = workflowname;
        this.toolTipData = {
          ekko: 'ebeln / bukrs / loekz / aedat / lifnr / waers',
          ekpo: 'ebeln / ebelp /	TXZ01 /	werks /	menge /	meins /	netpr /	netwr /	mwskz /	afnam',
          ekkn: 'ebeln /	ebelp /	kostl /	anln1 /	prctr /	PS_PSP_PNR',
          ekbe: 'ebeln /	ebelp /	gjahr /	belnr /	bewtp /	bwart /	menge /	elikz',
          lfa1: 'lifnr /	land1 /	name1'
        };
        this.getTciColumnsAndCount();
        break;
      case "RCR":
        this.workFlowTable = workflowname;
        this.toolTipData = {
          knmt: 'vkorg / vtweg / kunnr /	matnr /	kdmat',
          makt: 'matnr /	makt',
          marc: 'matnr / werks / prctr',
          kna1: 'kunnr / name1'
        };
        this.getRcrColumnsAndCount();
        break;
      case "VendorAdvance":
        this.workFlowTable = workflowname;
        this.toolTipData = {
          Bsak: 'augbl / gjahr / belnr ',
          Ekko: 'ebeln / bukrs / bstyp / bsart / lifnr / ekgrp / waers',
          Ekpos: 'knttp / ebeln / ebelp / bukrs / werks / netpr / peinh / afnam / loekz',
          Lfa1: 'lifnr / bukrs / sperr / name1',
          T024: 'ekgrp / eknam',
          Konv: 'knumv / kposn / Kschl / kwert',
          Ekbe: 'ebeln / ebelp / vgabe / giahr / belnr / wrbtr'
        };
        this.getVendorColumnsAndCount();
        break;
      case "FOC":
        this.workFlowTable = workflowname;
        this.toolTipData = {
          Knvv: 'kunnr /	name1 /	ckorg /	vtweg /	waers',
          Kna1: 'kunnr /	name1',
          Makt: 'matnr /	maktx',
          A005: 'kschl /	vkorg /	vtweg /	kunnr /	matnr /	datbi /	datab /	knumh',
          Konp: 'knumh / kbetr /	kpein',
          Mbew: 'matnr / 	bwkey /	stprs /	peinh',
          Marc: 'matnr /	werks /	prctr',
          Cepc: 'prctr /	datbi /	datab /	telf2'
        };
        this.getFocColumnsAndCount();
        break;
      case "SalesPrice":
        this.workFlowTable = workflowname;
        this.toolTipData = {
          Knmt: 'vkorg /	vtweg /	kunnr /	name1(kna1) /	matnr /	maktx(makt) /	kdmat',
          Marc: 'matnr / 	werks /	prctr',
          Cepc: 'prctr / datbi / datab /	telf2',
          A005: 'kschl /	vkorg /	vtweg /	kunnr /	matnr /	datbi /	datab /	knumh',
          Konp: 'knumh /	kbetr /	konwa',
          Makt: 'matnr /	maktx'
        };
        this.getSalesColumnsAndCount();
        break;
      default:
        break;
    }
  }



  selectedworkflowTableName(tableName) {
    switch (this.workFlowTable) {
      case "TCI":
        this._tciMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
        })
        this.selectTableFromWorkflow(tableName, "Add");
        if (tableName == this.approvalMatrix[this.workFlowTable]) {
          this.displayedColumns = ['Action', ...this.tableColumns];
        }
        this.selectedTciTableName(tableName);
        break;
      case "RCR":
        this._rcrMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
          // let date = new Date(res).toLocaleDateString();
          // this.lastUpdatedDate = date;
          // console.log(this.lastUpdatedDate)
        })
        this.selectTableFromWorkflow(tableName, "Add");
        if (tableName == this.approvalMatrix[this.workFlowTable]) {
          this.displayedColumns = ['Action', ...this.tableColumns];
        }
        this.checkMatrixTable(tableName);
        this.selectedRcrTableName(tableName);
        break;
      case "VendorAdvance":
        this._vendorMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
        })
        this.selectTableFromWorkflow(tableName, "Add");
        if (tableName == this.approvalMatrix[this.workFlowTable]) {
          this.displayedColumns = ['Action', ...this.tableColumns];
        }
        this.selectedVendorTableName(tableName);
        break;
      case "FOC":
        this._focMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
        })
        this.selectTableFromWorkflow(tableName, "Add");
        if (tableName == this.approvalMatrix[this.workFlowTable]) {
          this.displayedColumns = ['Action', ...this.tableColumns];
        }
        this.selectedFocTableName(tableName);
        break;
      case "SalesPrice":
        this._salesMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
        })
        this.selectTableFromWorkflow(tableName, "Add");

        this.selectedSalesTableName(tableName);
        break;
      default:
        break;
    }
  }

  executeSearch() {
    switch (this.workFlowTable) {
      case 'TCI':
        this.selectDataFromTciTable(this.selectedTable, 'Search');
        break;
      case 'RCR':
        this.selectDataFromRcrTable(this.selectedTable, 'Search');
        break;
      case 'VendorAdvance':
        this.selectDataFromVendorTable(this.selectedTable, 'Search');
        break;
      case 'FOC':
        this.selectDataFromFocTable(this.selectedTable, 'Search');
        break;
      case 'SalesPrice':
        this.selectDataFromSalesTable(this.selectedTable, 'Search');
        break;
    }
  }


  downloadMasterData() {
    switch (this.workFlowTable) {
      case 'TCI':
        this.selectDataFromTciTable(this.selectedTable, 'Download');
        break;
      case 'RCR':
        this.selectDataFromRcrTable(this.selectedTable, 'Download');
        break;
      case 'VendorAdvance':
        this.selectDataFromVendorTable(this.selectedTable, 'Download');
        break;
      case 'FOC':
        this.selectDataFromFocTable(this.selectedTable, 'Download');
        break;
      case 'SalesPrice':
        this.selectDataFromSalesTable(this.selectedTable, 'Download');
        break;
    }
  }


  editSelectedRow(index) {
    this.editingRowIndex = index;
    this.editRow = true;
    this.editForm.patchValue(this.dataSource.data[index]);
  }

  saveEdit(index) {
    if (this.editForm.valid) {
      this.editRow = false;
      this.editingRowIndex = -1;
      switch (this.workFlowTable) {
        case 'TCI':
          this._tciMasterService.UpdateMasterData(this.editForm.value).subscribe({
            next: (res) => {
              this._commonSnackBar.openSnackbar("Updated Successfully", snackbarStatus.Success);
              this.executeSearch();
            },
            error: (err) => {
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            }
          })
          break;
        case 'RCR':
          this._rcrMasterService.UpdateMasterData(this.editForm.value).subscribe({
            next: (res) => {
              this._commonSnackBar.openSnackbar("Updated Successfully", snackbarStatus.Success);
              this.executeSearch();
            },
            error: (err) => {
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            }
          });
          break;
        case 'VendorAdvance':
          this._vendorMasterService.UpdateMasterData(this.editForm.value).subscribe({
            next: (res) => {
              this._commonSnackBar.openSnackbar("Updated Successfully", snackbarStatus.Success);
              this.executeSearch();
            },
            error: (err) => {
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            }
          });
          break;
        case 'FOC':
          this._focMasterService.UpdateMasterData(this.editForm.value).subscribe({
            next: (res) => {
              this._commonSnackBar.openSnackbar("Updated Successfully", snackbarStatus.Success);
              this.executeSearch();
            },
            error: (err) => {
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            }
          });
          break;
        case 'SalesPrice':
          this._salesMasterService.UpdateMasterData(this.editForm.value).subscribe({
            next: (res) => {
              this._commonSnackBar.openSnackbar("Updated Successfully", snackbarStatus.Success);
              this.executeSearch();
            },
            error: (err) => {
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            }
          });
          break;
      }
    }
    else {
      this._commonSnackBar.openSnackbar("Please Fill All Required Fields", snackbarStatus.Danger);
    }

  }

  cancelEdit(index) {
    this.editRow = false;
    this.editingRowIndex = -1;
  }


  getLastUpdatedDate(tableName) {
    switch (this.workFlowTable) {
      case 'TCI':
        this._tciMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
        })
        return this.lastUpdatedDate;
      case 'RCR':
        this._rcrMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
        });
        return this.lastUpdatedDate;
      case 'VendorAdvance':
        this._vendorMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
        });
        return this.lastUpdatedDate;
      case 'FOC':
        this._focMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
        });
        return this.lastUpdatedDate;
      case 'SalesPrice':
        this._salesMasterService.GetLastUpdatedDate(tableName).subscribe(res => {
          this.lastUpdatedDate = res;
        });
        return this.lastUpdatedDate;
    }
  }

  getUploadMasterTables() {
    this._vendorMasterService.GetMasterTableColumnAndCount().subscribe({
      next: (response) => {
        this.tableColumns = response;
      }, error: (err) => {
        this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }

  async uploadMasterData(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const fileName: string = file.name.toLocaleLowerCase();
      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {

        const reader = new FileReader();

        reader.onload = (e: any) => {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const table: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });

          const extractedColumns: string[] = Object.keys(table[0]);

          // Check if extracted columns match the expected columns
          const columnsMatch = this.checkColumnsMatch(this.tableColumns, extractedColumns);

          if (columnsMatch) {
            // Proceed with further processing
            console.log(table);

            this._commonSpinner.showSpinner();

            this.selectTableToUploadData(table);


          }
          else {
            // Show an error message
            // console.error('Columns do not match the expected format.');
            this._commonSnackBar.openSnackbar("Columns do not match the expected format.", snackbarStatus.Danger);
          }
        };

        reader.readAsBinaryString(file);

      }
      else {
        this._commonSnackBar.openSnackbar("Invalid file format. Please upload a valid Excel file (.xlsx or .xls) and try again.", snackbarStatus.Danger);
      }
    }
  }



  checkColumnsMatch(expectedColumns: string[], extractedColumns: string[]): boolean {
    // Compare lengths
    if (expectedColumns.length !== extractedColumns.length) {
      return false;
    }

    // Compare each column name
    for (let i = 0; i < expectedColumns.length; i++) {
      if (expectedColumns[i] !== extractedColumns[i]) {
        return false;
      }
    }

    return true;
  }



  selectTableToUploadData(table) {
    if (this.selectedTable) {
      switch (this.workFlowTable) {
        case 'TCI':
          switch (this.selectedTable) {
            case "Vendors":
              this._tciMasterService.UploadDataVendorTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getTciColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Ekbe":
              this._tciMasterService.UploadDataEkbeTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getTciColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Ekko":
              this._tciMasterService.UploadDataEkkoTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getTciColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Ekkn":
              this._tciMasterService.UploadDataEkknTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getTciColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "UserRoleMaps":
              this._tciMasterService.UploadDataUserRoleMapTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "UserCredentials":
              table.forEach(element => {
                element.PasswordCreatedDate = new Date(element.PasswordCreatedDate)
              });
              this._tciMasterService.UploadDataUserTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "UserRoles":
              this._tciMasterService.UploadDataUserRoleTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getTciColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Zsec_Plant":
              this._tciMasterService.UploadDataZsec_PlantTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getTciColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Ekpo":
              this._tciMasterService.UploadDataEkpoTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getTciColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
          }
          break;
        case 'VendorAdvance':
          switch (this.selectedTable) {
            case "Bsak":
              this._vendorMasterService.UploadDataBsakTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Ekbe":
              this._vendorMasterService.UploadDataEkbeTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Ekko":
              this._vendorMasterService.UploadDataEkkoTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Konv":
              this._vendorMasterService.UploadDataKonvTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Lfa1":
              this._vendorMasterService.UploadDataLfa1Table(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Prps":
              this._vendorMasterService.UploadDataPrpsTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "T024":
              this._vendorMasterService.UploadDataT024Table(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "UserCredentials":
              this._tciMasterService.UploadDataUserTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "UserRoles":
              this._vendorMasterService.UploadDataUserRolesTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Zfi_Pmverifs":
              this._vendorMasterService.UploadDataZfi_PmverifsTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Zfi_T_Wroles":
              this._vendorMasterService.UploadDataZfi_T_WrolesTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Zpr_Mail":
              this._vendorMasterService.UploadDataZpr_MailTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Ekpos":
              this._vendorMasterService.UploadDataEkposTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getVendorColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
          }
          break;
        case 'RCR':
          switch (this.selectedTable) {
            case "kna1":

              this._rcrMasterService.UploadDataKna1Table(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "makt":
              this._rcrMasterService.UploadDataMaktTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "marc":
              this._rcrMasterService.UploadDataMarcTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Plantdetails":
              this._rcrMasterService.UploadDataPlantDetailsTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "UserRoleMaps":
              this._rcrMasterService.UploadDataUserRoleMapsTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "vbrp":
              this._rcrMasterService.UploadDatavbrpTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "UserCredentials":
              this._tciMasterService.UploadDataUserTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "UsersRoles":
              this._vendorMasterService.UploadDataUserRolesTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "zrcr_FirstApprovals":
              this._rcrMasterService.UploadDataZrcr_FirstApprovalsTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "knmt":
              this._rcrMasterService.UploadDataKnmtTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getRcrColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
          }
          break;
        case 'SalesPrice':
          switch (this.selectedTable) {
            case "A005":
              this._salesMasterService.UploadDataA005Table(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Cepc":
              this._salesMasterService.UploadDataCepcTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Kna1":
              this._salesMasterService.UploadDataKna1Table(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Knmt":
              this._salesMasterService.UploadDataKnmtTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Userroles":
              this._salesMasterService.UploadDataUserRolesTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Konp":
              this._salesMasterService.UploadDataKonpTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Marc":
              this._salesMasterService.UploadDataMarcTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Usercredentials":
              this._salesMasterService.UploadDataUserCredentialsTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Zsdcd_t_wfroles":
              this._salesMasterService.UploadDataZsdcd_t_wfrolesTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Knvv":
              this._salesMasterService.UploadDataKnvvTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getSalesColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
          }
          break;
        case 'FOC':
          switch (this.selectedTable) {
            case "A005":
              this._focMasterService.UploadDataA005Table(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Cepc":
              this._focMasterService.UploadDataCepcTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Focagents":
              this._focMasterService.UploadDataFocAgentTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Knvv":
              this._focMasterService.UploadDataKnvvTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Userroles":
              this._focMasterService.UploadDataUserRolesTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Konp":
              this._focMasterService.UploadDataKonpTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Marc":
              this._focMasterService.UploadDataMarcTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Usercredentials":
              this._focMasterService.UploadDataUserCredentialsTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Makt":
              this._focMasterService.UploadDataMaktTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Mbew":
              this._focMasterService.UploadDataMbewTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
            case "Tcurr":
              this._focMasterService.UploadDataTcurrTable(table).subscribe({
                next: (response) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(response.Result, snackbarStatus.Success);
                  this.getFocColumnsAndCount();
                }, error: (err) => {
                  this._commonSpinner.hideSpinner();
                  this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
                },
              });
              break;
          }
          break;
      }
    }
  }



  /** TCI Workflow */

  getTciColumnsAndCount() {
    this._tciMasterService.GetMasterTableColumnAndCount().subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableNames = response;
        this.selectedTable = this.tableNames[0].TableName;
        this.getTciTableColumns(this.selectedTable);
        this.getLastUpdatedDate(this.selectedTable);
        this.selectTableFromWorkflow(this.selectedTable, "Add");
      }, error: (err) => {
        if (this.workFlowTable == 'TCI') {
          this.showSpinner = false;
          this.tableNames = null;
          this.selectedTable = '';
        }
        this._commonSnackBar.openSnackbar(`TCI - ${err}`, snackbarStatus.Danger);
      },
    })
  }

  getTciTableColumns(tableName) {
    this._tciMasterService.GetTableColumns(tableName).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableColumns = response;
        this.removeAllControls();
        if (tableName == this.approvalMatrix[this.workFlowTable]) {
          this.addFormControls(this.tableColumns);
          this.displayedColumns = ['Action', ...this.tableColumns];
        }
        else {
          this.displayedColumns = this.tableColumns;
        }
      }, error: (err) => {
        this.showSpinner = false;
        this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }


  selectedTciTableName(tableName) {
    this.selectedTable = tableName;
    this.getTciTableColumns(tableName);
  }


  /** TCI Workflow End */


  /** RCR Workflow */

  getRcrColumnsAndCount() {
    this._rcrMasterService.GetMasterTableColumnAndCount().subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableNames = response;
        this.selectedTable = this.tableNames[0].TableName;
        this.getRcrTableColumns(this.selectedTable);
        this.getLastUpdatedDate(this.selectedTable);
        this.selectTableFromWorkflow(this.selectedTable, "Add");
      }, error: (err) => {
        if (this.workFlowTable == 'RCR') {
          this.showSpinner = false;
          this.tableNames = null;
          this.selectedTable = '';
        }
        this._commonSnackBar.openSnackbar(`RCR - ${err}`, snackbarStatus.Danger);
      },
    })
  }

  getRcrTableColumns(tableName) {
    this._rcrMasterService.GetTableColumns(tableName).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableColumns = response;
        this.removeAllControls();
        if (tableName == this.approvalMatrix[this.workFlowTable]) {
          this.addFormControls(this.tableColumns);
          this.displayedColumns = ['Action', ...this.tableColumns];
        }
        else {
          this.displayedColumns = this.tableColumns;
        }
      }, error: (err) => {
        this.showSpinner = false;
        this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }

  selectedRcrTableName(tableName) {
    this.selectedTable = tableName;
    this.getRcrTableColumns(tableName);
  }

  checkMatrixTable(tableName) {
    var value = this.rcrMatrices.includes(tableName);
  }

  /** RCR Workflow End */


  /** Vendor Advance Workflow */

  getVendorColumnsAndCount() {
    this._vendorMasterService.GetMasterTableColumnAndCount().subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableNames = response;
        this.selectedTable = this.tableNames[0].TableName;
        this.getVendorTableColumns(this.selectedTable);
        this.getLastUpdatedDate(this.selectedTable);
        this.selectTableFromWorkflow(this.selectedTable, "Add");
      }, error: (err) => {
        if (this.workFlowTable == 'VendorAdvance') {
          this.showSpinner = false;
          this.tableNames = null;
          this.selectedTable = '';
        }
        this._commonSnackBar.openSnackbar(`Vendor Advance - ${err}`, snackbarStatus.Danger);
      },
    })
  }

  getVendorTableColumns(tableName) {
    this._vendorMasterService.getTableColumns(tableName).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableColumns = response;
        this.removeAllControls();
        if (tableName == this.approvalMatrix[this.workFlowTable]) {
          this.addFormControls(this.tableColumns);
          this.displayedColumns = ['Action', ...this.tableColumns];
        }
        else {
          this.displayedColumns = this.tableColumns;
        }
      }, error: (err) => {
        this.showSpinner = false;
        this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }

  selectedVendorTableName(tableName) {
    this.selectedTable = tableName;
    this.getVendorTableColumns(tableName);
  }

  /** Vendor Advance End */


  /** FOC Workflow */

  getFocColumnsAndCount() {
    this._focMasterService.GetMasterTableColumnAndCount().subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableNames = response;
        this.selectedTable = this.tableNames[0].TableName;
        this.getFocTableColumns(this.selectedTable);
        this.getLastUpdatedDate(this.selectedTable);
        this.selectTableFromWorkflow(this.selectedTable, "Add");
      }, error: (err) => {
        if (this.workFlowTable == 'FOC') {
          this.showSpinner = false;
          this.tableNames = null;
          this.selectedTable = '';
        }
        this._commonSnackBar.openSnackbar(`FOC - ${err}`, snackbarStatus.Danger);
      },
    })
  }

  getFocTableColumns(tableName) {
    this._focMasterService.getTableColumns(tableName).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableColumns = response;
        this.removeAllControls();
        if (tableName == this.approvalMatrix[this.workFlowTable]) {
          this.addFormControls(this.tableColumns);
          this.displayedColumns = ['Action', ...this.tableColumns];
        }
        else {
          this.displayedColumns = this.tableColumns;
        }
      }, error: (err) => {
        this.showSpinner = false;
        this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }

  selectedFocTableName(tableName) {
    this.selectedTable = tableName;
    this.getFocTableColumns(tableName);
  }
  /** FOC Workflow End */


  /** Sales Price Workflow */

  getSalesColumnsAndCount() {
    this._salesMasterService.GetMasterTableColumnAndCount().subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableNames = response;
        this.selectedTable = this.tableNames[0].TableName;
        this.getSalesTableColumns(this.selectedTable);
        this.getLastUpdatedDate(this.selectedTable);
        this.selectTableFromWorkflow(this.selectedTable, "Add");
      }, error: (err) => {
        if (this.workFlowTable == 'SalesPrice') {
          this.showSpinner = false;
          this.tableNames = null;
          this.selectedTable = '';
        }
        this._commonSnackBar.openSnackbar(`SalesPrice - ${err}`, snackbarStatus.Danger);
      },
    })
  }

  getSalesTableColumns(tableName) {
    this._salesMasterService.GetTableColumns(tableName).subscribe({
      next: (response) => {
        this.showSpinner = false;
        this.tableColumns = response;
        this.removeAllControls();
        if (tableName == this.approvalMatrix[this.workFlowTable]) {
          this.addFormControls(this.tableColumns);
          this.displayedColumns = ['Action', ...this.tableColumns];
        }
        else {
          this.displayedColumns = this.tableColumns;
        }
      }, error: (err) => {
        this.showSpinner = false;
        this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }

  selectedSalesTableName(tableName) {
    this.selectedTable = tableName;
    this.getSalesTableColumns(tableName);
  }

  /** Sales Price Workflow End */

  // Method to add controls

  addControl(fields) {
    fields.forEach(element => {
      this.masterTableFormGroup.addControl(element.Label, this._fb.control('', Validators.required));
    });
  }

  // Method to remove controls
  removeControls(fields: any[]) {
    fields.forEach(field => {
      this.masterTableFormGroup.removeControl(field.Label);
    });
  }

  // Action Methods of Each WorkFlow


  selectDataFromTciTable(selectedTableName, type) {
    this.notes = "";
    this.dataSource = new MatTableDataSource();
    switch (selectedTableName) {
      case "ekkn":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getTciTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._tciMasterService.getEkknTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next: (response) => {
                this.getTciTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Purchasing Document No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._tciMasterService.getEkknMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "ekbe":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getTciTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._tciMasterService.getEkbeTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next: (response) => {
                this.getTciTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Purchasing Document No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._tciMasterService.getEkbeMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "ekko":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getTciTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._tciMasterService.getEkkoTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next: (response) => {
                this.getTciTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Purchasing Document No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._tciMasterService.getEkkoMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "ekpo":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getTciTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._tciMasterService.getEkpoTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next: (response) => {
                this.getTciTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Purchasing Document No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._tciMasterService.getEkpoMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserRoleMaps":
        this.selectedTable = selectedTableName;
        this.notes = "bukrs/sperr from LFB1";
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "ProfitCenter",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getTciTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._tciMasterService.getUserRoleMapTableData(this.masterTableFormGroup.value.ProfitCenter).subscribe({
              next: (response) => {
                this.getTciTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Profit Center", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._tciMasterService.getUserRoleMapMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserRoles":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Role",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getTciTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._tciMasterService.getUserRoleTableData(this.masterTableFormGroup.value.Role).subscribe({
              next: (response) => {
                this.getTciTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Role", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._tciMasterService.getUserRoleMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Zsec_Plant":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "TaxCode",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getTciTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._tciMasterService.getZsec_PlantTableData(this.masterTableFormGroup.value.TaxCode).subscribe({
              next: (response) => {
                this.getTciTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Tax Code", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._tciMasterService.getZsec_PlantMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserCredentials":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getTciTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._tciMasterService.getUserTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next: (response) => {
                this.getTciTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter User Id", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._tciMasterService.getUserMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Vendors":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "VendorCode",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getTciTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._tciMasterService.getVendorTableData(this.masterTableFormGroup.value.VendorCode).subscribe({
              next: (response) => {
                this.getTciTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Vendor Code", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._tciMasterService.getVendorMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
    }
  }

  selectDataFromRcrTable(selectedTableName, type) {
    this.notes = "";
    this.dataSource = new MatTableDataSource();
    switch (selectedTableName) {
      case "vbrp":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "CustomerPartNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getvbrpTableData(this.masterTableFormGroup.value.CustomerPartNo).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Customer Part No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getvbrpMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserRoleMaps":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Profitcenter",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getUserRoleMapsTableData(this.masterTableFormGroup.value.Profitcenter).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Profit Center", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getUserRoleMapsMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "PlantDetails":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Plant",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getPlantDetailsTableData(this.masterTableFormGroup.value.Plant).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Plant Code", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getPlantDetailsMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "makt":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "ContiMaterialNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getMaktTableData(this.masterTableFormGroup.value.ContiMaterialNo).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Conti Material No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getMaktMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "kna1":
        this.selectedTable = selectedTableName;
        this.notes = "bukrs/sperr from LFB1";
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "CustomerCode",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getKna1TableData(this.masterTableFormGroup.value.CustomerCode).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Customer Code", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getKna1MasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "marc":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "ContiMaterialNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getMarcTableData(this.masterTableFormGroup.value.ContiMaterialNo).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Conti Material No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getMarcMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "knmt":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "CustomerMaterialNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getKnmtTableData(this.masterTableFormGroup.value.CustomerMaterialNo).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Customer Material No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getKnmtMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserCredentials":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getUserCredentialsTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter User Id", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getUserCredentialsMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UsersRoles":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Role",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getUserRolesTableData(this.masterTableFormGroup.value.Role).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Role", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getUserRolesMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "zrcr_FirstApprovals":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "ProfitCenter",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getRcrTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._rcrMasterService.getZrcr_FirstApprovalsTableData(this.masterTableFormGroup.value.ProfitCenter).subscribe({
              next: (response) => {
                this.getRcrTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Profit Center No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._rcrMasterService.getZrcr_FirstApprovalsMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
    }
  }

  selectDataFromVendorTable(selectedTableName, type) {
    this.notes = "";
    this.dataSource = new MatTableDataSource();
    switch (selectedTableName) {
      case "Bsak":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "MaterialDocumentNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getBsakTableData(this.masterTableFormGroup.value.MaterialDocumentNo).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Material Document No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getBsakMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Ekbe":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getEkbeTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Purchasing Document No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getEkbeMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Ekko":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getEkkoTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Purchasing Document No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getEkkoMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Konv":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "DocumentCoditionNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getKonvTableData(this.masterTableFormGroup.value.DocumentCoditionNo).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Document Codition No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getKonvMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Lfa1":
        this.selectedTable = selectedTableName;
        this.notes = "bukrs/sperr from LFB1";
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Vendor",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getLfa1TableData(this.masterTableFormGroup.value.Vendor).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Vendor", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getLfa1MasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Prps":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "WbsElement",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getPrpsTableData(this.masterTableFormGroup.value.WbsElement).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Wbs Element", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getPrpsMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "T024":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "PurchasingGroup",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getT024TableData(this.masterTableFormGroup.value.PurchasingGroup).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Purchasing Group", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getT024MasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserCredentials":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getUserCredentialsTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter User Id", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getUserCredentialsMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserRoles":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Role",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getUserRolesTableData(this.masterTableFormGroup.value.Role).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Role", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getUserRolesMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Zfi_Pmverifs":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getZfi_PmverifsTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter User Id", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getZfi_PmverifsMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Zfi_T_Wroles":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "CompanyCode",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getZfi_T_WrolesTableData(this.masterTableFormGroup.value.CompanyCode).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Company Code", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getZfi_T_WrolesMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Zpr_Mail":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getZpr_MailTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter User Id", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getZpr_MailMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Ekpos":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getVendorTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._vendorMasterService.getEkposTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next: (response) => {
                this.getVendorTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Purchasing Document", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._vendorMasterService.getEkposMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
    }
  }

  selectDataFromFocTable(selectedTableName, type) {
    this.notes = "";
    this.dataSource = new MatTableDataSource();
    switch (selectedTableName) {
      case "A005":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "MaterialNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getA005TableData(this.masterTableFormGroup.value.MaterialNo).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Material Document No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getA005MasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Cepc":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Profitcenter",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getCepcTableData(this.masterTableFormGroup.value.Profitcenter).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Profit Center", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getCepcMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Knvv":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Customercode",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getKnvvTableData(this.masterTableFormGroup.value.Customercode).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Customer Code", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getKnvvMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Konp":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "ConditionRecNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getKonpTableData(this.masterTableFormGroup.value.ConditionRecNo).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter CoditionRec No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getKonpMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Makt":
        this.selectedTable = selectedTableName;
        this.notes = "bukrs/sperr from LFB1";
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "MaterialNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getMaktTableData(this.masterTableFormGroup.value.MaterialNo).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Material No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getMaktMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Marc":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "MaterialNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getMarcTableData(this.masterTableFormGroup.value.MaterialNo).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Material No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getMarcMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Tcurr":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "FromCurrency",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getTcurrTableData(this.masterTableFormGroup.value.FromCurrency).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter From Currency", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getTcurrMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserCredentials":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getUserCredentialsTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter User Id", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getUserCredentialsMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserRoles":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Role",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getUserRolesTableData(this.masterTableFormGroup.value.Role).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Role", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getUserRolesMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Mbew":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "MaterialNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getMbewTableData(this.masterTableFormGroup.value.MaterialNo).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Material No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getMbewMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "FocAgents":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Plant",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getFocTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._focMasterService.getFocAgentTableData(this.masterTableFormGroup.value.Plant).subscribe({
              next: (response) => {
                this.getFocTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Plant No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._focMasterService.getFocAgentMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
    }
  }

  selectDataFromSalesTable(selectedTableName, type) {
    this.notes = "";
    this.dataSource = new MatTableDataSource();
    switch (selectedTableName) {
      case "A005":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "ContiMaterialNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getA005TableData(this.masterTableFormGroup.value.ContiMaterialNo).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter ContiMaterial No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getA005MasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Cepc":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Profitcenter",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getCepcTableData(this.masterTableFormGroup.value.Profitcenter).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Profit Center", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getCepcMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Knvv":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Customercode",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getKnvvTableData(this.masterTableFormGroup.value.Customercode).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Customer Code", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getKnvvMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Konp":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "ConditionRecNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getKonpTableData(this.masterTableFormGroup.value.ConditionRecNo).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter CoditionRec No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getKonpMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Kna1":
        this.selectedTable = selectedTableName;
        this.notes = "bukrs/sperr from LFB1";
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Customercode",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getKna1TableData(this.masterTableFormGroup.value.Customercode).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Customer Code", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getKna1MasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Marc":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "ContiMaterialNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getMarcTableData(this.masterTableFormGroup.value.ContiMaterialNo).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter ContiMaterial No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getMarcMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Knmt":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "CustomerPartNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getKnmtTableData(this.masterTableFormGroup.value.CustomerPartNo).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter  CustomerPart No", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getKnmtMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserCredentials":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getUserCredentialsTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter User Id", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getUserCredentialsMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserRoles":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Role",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getUserRolesTableData(this.masterTableFormGroup.value.Role).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Role", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getUserRolesMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Zsdcd_t_wfroles":
        this.selectedTable = selectedTableName;
        if (type == "Add") {
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label: "Outlet",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.getSalesTableColumns(this.selectedTable);
        }
        else if (type == "Search") {
          if (this.masterTableFormGroup.valid) {
            this._salesMasterService.getZsdcd_t_wfrolesTableData(this.masterTableFormGroup.value.Outlet).subscribe({
              next: (response) => {
                this.getSalesTableColumns(this.selectedTable);
                this.dataSource = new MatTableDataSource(response);
              }, error: (err) => {
                this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else {
            this._commonSnackBar.openSnackbar("Enter Outlet", snackbarStatus.Danger);
          }
        }
        else if (type == "Download") {
          this._commonSpinner.showSpinner();
          this._salesMasterService.getZsdcd_t_wfrolesMasterData(this.selectedTable).subscribe({
            next: async (response) => {
              if (response) {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            }, error: (err) => {
              this._commonSpinner.hideSpinner();
              this._commonSnackBar.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
    }
  }



  selectTableFromWorkflow(tableName, type) {
    switch (this.workFlowTable) {
      case "TCI":
        this.selectDataFromTciTable(tableName, type);
        break;
      case "RCR":
        this.selectDataFromRcrTable(tableName, type);
        break;
      case "VendorAdvance":
        this.selectDataFromVendorTable(tableName, type);
        break;
      case "FOC":
        this.selectDataFromFocTable(tableName, type);
        break;
      case "SalesPrice":
        this.selectDataFromSalesTable(tableName, type);
        break;
      default:
        break;
    }
  }




}