import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  constructor() { }

  errorHandler(error: HttpErrorResponse): Observable<any> {
    return throwError(error);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var newRequest;
    var workflowname = localStorage.getItem("WorkflowName");
    switch (workflowname) {
      case "TCI":
        newRequest = request.clone({
          url: environment.tciAddress + request.url
        })
        break;
      case "RCR":
        newRequest = request.clone({
          url: environment.rcrAddress + request.url
        })
        break;
      case "VendorAdvance":
        newRequest = request.clone({
          url: environment.vendorAddress + request.url
        })
        break;
      case "FOC":
        newRequest = request.clone({
          url: environment.focAddress + request.url
        })
        break;
      case "SalesPrice":
        newRequest = request.clone({
          url: environment.salesAddress + request.url
        })
        break;
    }
    return next.handle(newRequest).pipe(catchError(this.errorHandler));
  }
}
