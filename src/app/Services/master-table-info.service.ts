import { Injectable } from '@angular/core';

@Injectable()

export class MasterTableInfoService {
    tableName: string = '';

    tableInfo = {
        TCI: {
            displayedColumns: ["ID", "poNumber", "price", "currency"],
            name: "Bsak"
        },
        Enko: {
            displayedColumns: ['ID', 'PO_Number', 'Price', 'Currency'],
            title: "Enko"
        },
        Ekko: {
            displayedColumns: ['id', 'materialName', 'PO_Number'],
            title: "Ekko"
        },
        Acc: {
            displayedColumns: ['ID', 'PO_Number', 'Price', 'Currency'],
            title: "Acc"
        },
    }
}