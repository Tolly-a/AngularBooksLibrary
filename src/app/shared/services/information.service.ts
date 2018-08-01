import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()

export class InformationService{
    private serviceData = new BehaviorSubject<any>(null);

    setData(data:any){
        this.serviceData.next(data);
    }

    getData():Observable<any>{
        return this.serviceData.asObservable();
    }
}
