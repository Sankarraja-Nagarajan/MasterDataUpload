import { Injectable } from '@angular/core';

@Injectable()

export class MasterTableInfoService {
    tableName: string = 'TCI';

    tableInfo = {
        TCI: {
            displayedColumns: ["ID", "PO_Number", "Price", "Currency"],
            name: "Bsak"
        },
        RCR: {
            displayedColumns: ['ID', 'PO_Number', 'Price', 'Currency'],
            title: "Enko"
        },
        FOC: {
            displayedColumns: ['id', 'materialName', 'PO_Number'],
            title: "Ekko"
        },
        VendorAdvance: {
            displayedColumns: ['ID', 'PO_Number', 'Price', 'Currency'],
            title: "Acc"
        },
        SalesPrice: {
            displayedColumns: ['ID', 'PO_Number', 'Price', 'Currency'],
            title: "Acc"
        },
    }
}