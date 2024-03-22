import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesMasterDataService {

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


  // A005 Master Data Upload

  getA005TableData(contiMaterialNo): Observable<any> {
    return this._httpService.get(`MasterData/GetA005TableData?contiMaterialNo=${contiMaterialNo}`);
  }

  getA005MasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetA005MasterData?tableName=${tableName}`);
  }

  UploadDataA005Table(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataA005Table`, data);
  }



  // Cepc Master Data Upload

  getCepcTableData(profitCenter): Observable<any> {
    return this._httpService.get(`MasterData/GetCepcTableData?profitCenter=${profitCenter}`);
  }

  getCepcMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetCepcMasterData?tableName=${tableName}`);
  }

  UploadDataCepcTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataCepcTable`, data);
  }




  // Knvv Master Data Upload

  getKnvvTableData(customerCode): Observable<any> {
    return this._httpService.get(`MasterData/GetKnvvTableData?customerCode=${customerCode}`);
  }

  getKnvvMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetKnvvMasterData?tableName=${tableName}`);
  }

  UploadDataKnvvTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataKnvvTable`, data);
  }





  // Konp Master Data Upload

  getKonpTableData(conditionRecNo): Observable<any> {
    return this._httpService.get(`MasterData/GetKonpTableData?conditionRecNo=${conditionRecNo}`);
  }

  getKonpMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetKonpMasterData?tableName=${tableName}`);
  }

  UploadDataKonpTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataKonpTable`, data);
  }






  // Kna1 Master Data Upload

  getKna1TableData(customerCode): Observable<any> {
    return this._httpService.get(`MasterData/GetKna1TableData?customerCode=${customerCode}`);
  }

  getKna1MasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetKna1MasterData?tableName=${tableName}`);
  }

  UploadDataKna1Table(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataKna1Table`, data);
  }






  // Marc Master Data Upload

  getMarcTableData(contiMaterialNo): Observable<any> {
    return this._httpService.get(`MasterData/GetMarcTableData?contiMaterialNo=${contiMaterialNo}`);
  }

  getMarcMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetMarcMasterData?tableName=${tableName}`);
  }

  UploadDataMarcTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataMarcTable`, data);
  }


  // Knmt Master Data Upload

  getKnmtTableData(customerPartNo): Observable<any> {
    return this._httpService.get(`MasterData/GetKnmtTableData?customerPartNo=${customerPartNo}`);
  }

  getKnmtMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetKnmtMasterData?tableName=${tableName}`);
  }

  UploadDataKnmtTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataKnmtTable`, data);
  }




  // Zsdcd_t_wfroles Master Data Upload

  getZsdcd_t_wfrolesTableData(outlet): Observable<any> {
    return this._httpService.get(`MasterData/GetZsdcd_t_wfrolesTableData?outlet=${outlet}`);
  }

  getZsdcd_t_wfrolesMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetZsdcd_t_wfrolesMasterData?tableName=${tableName}`);
  }

  UploadDataZsdcd_t_wfrolesTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataZsdcd_t_wfrolesTable`, data);
  }

  UpdateMasterData(data: any): Observable<any> {
    return this._httpService.post(`MasterData/UpdateMasterData`, data)
  }







  // UserCredential Master Data Upload

  getUserCredentialsTableData(userId): Observable<any> {
    return this._httpService.get(`MasterData/GetUserCredentialTableData?userId=${userId}`);
  }

  getUserCredentialsMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetUserCredentialMasterData?tableName=${tableName}`);
  }

  UploadDataUserCredentialsTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataUserCredentialTable`, data);
  }



  // UserRoles Master Data Upload

  getUserRolesTableData(role): Observable<any> {
    return this._httpService.get(`MasterData/GetUserRolesTableData?role=${role}`);
  }

  getUserRolesMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetUserRolesMasterData?tableName=${tableName}`);
  }

  UploadDataUserRolesTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataUserRolesTable`, data);
  }


}
