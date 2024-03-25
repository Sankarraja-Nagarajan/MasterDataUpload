import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpService } from "../http.service";

@Injectable({
    providedIn: 'root'
})

export class FocMasterDataService {

    constructor(private _httpService: HttpService) { }

    GetMasterTableColumnAndCount(): Observable<any> {
        return this._httpService.get(`MasterTable/GetMasterTableColumnAndCount`);
    }

    getTableColumns(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetTableColumns?tableName=${tableName}`);
    }

    GetLastUpdatedDate(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetLastUpdatedDate?tableName=${tableName}`)
    }

    // A005 Master Data Upload

    getA005TableData(materialDocumentNo): Observable<any> {
        return this._httpService.get(`MasterTable/GetA005TableData?materialNo=${materialDocumentNo}`);
    }

    getA005MasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetA005MasterData?tableName=${tableName}`);
    }

    UploadDataA005Table(bsakData): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataA005Table`, bsakData);
    }



    // Cepc Master Data Upload

    getCepcTableData(profitCenter): Observable<any> {
        return this._httpService.get(`MasterTable/GetCepcTableData?profitCenter=${profitCenter}`);
    }

    getCepcMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetCepcMasterData?tableName=${tableName}`);
    }

    UploadDataCepcTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataCepcTable`, data);
    }




    // Knvv Master Data Upload

    getKnvvTableData(customerCode): Observable<any> {
        return this._httpService.get(`MasterTable/GetKnvvTableData?customerCode=${customerCode}`);
    }

    getKnvvMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetKnvvMasterData?tableName=${tableName}`);
    }

    UploadDataKnvvTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataKnvvTable`, data);
    }





    // Konp Master Data Upload

    getKonpTableData(conditionRecNo): Observable<any> {
        return this._httpService.get(`MasterTable/GetKonpTableData?conditionRecNo=${conditionRecNo}`);
    }

    getKonpMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetKonpMasterData?tableName=${tableName}`);
    }

    UploadDataKonpTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataKonpTable`, data);
    }




    // Makt Master Data Upload

    getMaktTableData(materialNo): Observable<any> {
        return this._httpService.get(`MasterTable/GetMaktTableData?materialNo=${materialNo}`);
    }

    getMaktMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetMaktMasterData?tableName=${tableName}`);
    }

    UploadDataMaktTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataMaktTable`, data);
    }






    // Marc Master Data Upload

    getMarcTableData(materialNo): Observable<any> {
        return this._httpService.get(`MasterTable/GetMarcTableData?materialNo=${materialNo}`);
    }

    getMarcMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetMarcMasterData?tableName=${tableName}`);
    }

    UploadDataMarcTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataMarcTable`, data);
    }

    // Mbew Master Data Upload

    getMbewTableData(materialNo): Observable<any> {
        return this._httpService.get(`MasterTable/GetMbewTableData?materialNo=${materialNo}`);
    }

    getMbewMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetMbewMasterData?tableName=${tableName}`);
    }

    UploadDataMbewTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataMbewTable`, data);
    }




    // Tcurr Master Data Upload

    getTcurrTableData(fromCurrency): Observable<any> {
        return this._httpService.get(`MasterTable/GetTcurrTableData?fromCurrency=${fromCurrency}`);
    }

    getTcurrMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetTcurrMasterData?tableName=${tableName}`);
    }

    UploadDataTcurrTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataTcurrTable`, data);
    }







    // UserCredential Master Data Upload

    getUserCredentialsTableData(userId): Observable<any> {
        return this._httpService.get(`MasterTable/GetUserCredentialTableData?userId=${userId}`);
    }

    getUserCredentialsMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetUserCredentialMasterData?tableName=${tableName}`);
    }

    UploadDataUserCredentialsTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataUserCredentialTable`, data);
    }



    // UserRoles Master Data Upload

    getUserRolesTableData(role): Observable<any> {
        return this._httpService.get(`MasterTable/GetUserRolesTableData?role=${role}`);
    }

    getUserRolesMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetUserRolesMasterData?tableName=${tableName}`);
    }

    UploadDataUserRolesTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataUserRolesTable`, data);
    }

    UpdateMasterData(data: any): Observable<any> {
        return this._httpService.post(`MasterTable/UpdateMasterData`, data)
    }


    // FocAgent Master Data Upload


    getFocAgentTableData(Plant): Observable<any> {
        return this._httpService.get(`MasterTable/GetFocAgentTableData?Plant=${Plant}`);
    }

    getFocAgentMasterData(tableName): Observable<any> {
        return this._httpService.get(`MasterTable/GetFocAgentMasterData?tableName=${tableName}`);
    }

    UploadDataFocAgentTable(data): Observable<any> {
        return this._httpService.post(`MasterTable/UploadDataFocAgentTable`, data);
    }

}