import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TciMasterDataService {

  constructor(private _httpService: HttpService) { }

  GetMasterTableColumnAndCount(): Observable<any> {
    return this._httpService.get(`MasterData/GetMasterTableColumnAndCount`);
  }

  GetTableColumns(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetTableColumns?tableName=${tableName}`);
  }

  GetLastUpdatedDate(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetLastUpdatedDate?tableName=${tableName}`)
  }

  // Ekkn Master Data Upload

  getEkknTableData(purchasingDocument): Observable<any> {
    return this._httpService.get(`MasterData/GetEkknTableData?purchasingDocument=${purchasingDocument}`);
  }

  getEkknMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetEkknMasterData?tableName=${tableName}`);
  }

  UploadDataEkknTable(EkknData): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataEkknTable`, EkknData);
  }

  //Vendor Master Data Uopload

  getVendorTableData(vendorCode): Observable<any> {
    return this._httpService.get(`MasterData/GetVendorTableData?vendorCode=${vendorCode}`);
  }

  getVendorMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetVendorMasterData?tableName=${tableName}`);
  }

  UploadDataVendorTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataVendorTable`, data);
  }


  // Ekbe Master Data Upload

  getEkbeTableData(purchasingDocument): Observable<any> {
    return this._httpService.get(`MasterData/GetEkbeTableData?purchasingDocument=${purchasingDocument}`);
  }

  getEkbeMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetEkbeMasterData?tableName=${tableName}`);
  }

  UploadDataEkbeTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataEkbeTable`, data);
  }




  // Ekko Master Data Upload

  getEkkoTableData(purchasingDocument): Observable<any> {
    return this._httpService.get(`MasterData/GetEkkoTableData?purchasingDocument=${purchasingDocument}`);
  }

  getEkkoMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetEkkoMasterData?tableName=${tableName}`);
  }

  UploadDataEkkoTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataEkkoTable`, data);
  }





  // Ekpo Master Data Upload

  getEkpoTableData(purchasingDocument): Observable<any> {
    return this._httpService.get(`MasterData/GetEkpoTableData?purchasingDocument=${purchasingDocument}`);
  }

  getEkpoMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetEkpoMasterData?tableName=${tableName}`);
  }

  UploadDataEkpoTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataEkpoTable`, data);
  }





  // UserRoleMap Master Data Upload

  getUserRoleMapTableData(profitCenter): Observable<any> {
    return this._httpService.get(`MasterData/GetUserRoleMapTableData?profitCenter=${profitCenter}`);
  }

  getUserRoleMapMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetUserRoleMapMasterData?tableName=${tableName}`);
  }

  UploadDataUserRoleMapTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataUserRoleMapTable`, data);
  }

  UpdateMasterData(data: any): Observable<any> {
    console.log(data);
    return this._httpService.post(`MasterData/UpdateMasterData`, data)
  }





  // Zsec_Plant Master Data Upload

  getZsec_PlantTableData(taxCode): Observable<any> {
    return this._httpService.get(`MasterData/GetZsec_PlantTableData?taxCode=${taxCode}`);
  }

  getZsec_PlantMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetZsec_PlantMasterData?tableName=${tableName}`);
  }

  UploadDataZsec_PlantTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataZsec_PlantTable`, data);
  }







  // User Master Data Upload

  getUserTableData(userId): Observable<any> {
    return this._httpService.get(`MasterData/GetUserTableData?userId=${userId}`);
  }

  getUserMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetUserMasterData?tableName=${tableName}`);
  }

  UploadDataUserTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataUserTable`, data);
  }




  // UserRole Master Data Upload

  getUserRoleTableData(role): Observable<any> {
    return this._httpService.get(`MasterData/GetUserRoleTableData?role=${role}`);
  }

  getUserRoleMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetUserRoleMasterData?tableName=${tableName}`);
  }

  UploadDataUserRoleTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataUserRoleTable`, data);
  }


}
