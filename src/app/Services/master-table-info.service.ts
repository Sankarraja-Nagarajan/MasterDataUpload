import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()

export class MasterTableInfoService {

    workFlowName: string = '';

    constructor() { }


    // workflowObservable = new Observable(subscriber => {
    //     subscriber.next(this.workFlowName);
    // })

    public dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


    setData(data: any) {
        this.workFlowName = data;
        this.dataSubject.next(this.workFlowName);
    }
}