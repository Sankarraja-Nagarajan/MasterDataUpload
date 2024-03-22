import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class RcrMasterDataService {

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

  // Makt Master Data Upload

  getMaktTableData(contiMaterialNo): Observable<any> {
    return this._httpService.get(`MasterData/GetMaktTableData?contiMaterialNo=${contiMaterialNo}`);
  }

  getMaktMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetMaktMasterData?tableName=${tableName}`);
  }

  UploadDataMaktTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataMaktTable`, data);
  }



  // PlantDetails Master Data Upload

  getPlantDetailsTableData(plant): Observable<any> {
    return this._httpService.get(`MasterData/GetPlantDetailTableData?plant=${plant}`);
  }

  getPlantDetailsMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetPlantDetailMasterData?tableName=${tableName}`);
  }

  UploadDataPlantDetailsTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataPlantDetailTable`, data);
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

  getKnmtTableData(customerMaterialNo): Observable<any> {
    return this._httpService.get(`MasterData/GetKnmtTableData?customerMaterialNo=${customerMaterialNo}`);
  }

  getKnmtMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetKnmtMasterData?tableName=${tableName}`);
  }

  UploadDataKnmtTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataKnmtTable`, data);
  }




  // Zrcr_FirstApprovals Master Data Upload

  getZrcr_FirstApprovalsTableData(profitCenter): Observable<any> {
    return this._httpService.get(`MasterData/GetZrcr_FirstApprovalTableData?profitCenter=${profitCenter}`);
  }

  getZrcr_FirstApprovalsMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetZrcr_FirstApprovalMasterData?tableName=${tableName}`);
  }

  UploadDataZrcr_FirstApprovalsTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataZrcr_FirstApprovalTable`, data);
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



  // UserRoleMaps Master Data Upload

  getUserRoleMapsTableData(profitCenter): Observable<any> {
    return this._httpService.get(`MasterData/GetUserRoleMapTableData?profitCenter=${profitCenter}`);
  }

  getUserRoleMapsMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetUserRoleMapMasterData?tableName=${tableName}`);
  }

  UploadDataUserRoleMapsTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataUserRoleMapTable`, data);
  }


  UpdateMasterData(data: any): Observable<any> {
    return this._httpService.post(`MasterData/UpdateMasterData`, data)
  }


  // vbrp Master Data Upload

  getvbrpTableData(customerPartNo): Observable<any> {
    return this._httpService.get(`MasterData/GetVbrpTableData?customerPartNo=${customerPartNo}`);
  }

  getvbrpMasterData(tableName): Observable<any> {
    return this._httpService.get(`MasterData/GetVbrpMasterData?tableName=${tableName}`);
  }

  UploadDatavbrpTable(data): Observable<any> {
    return this._httpService.post(`MasterData/UploadDataVbrpTable`, data);
  }

}
