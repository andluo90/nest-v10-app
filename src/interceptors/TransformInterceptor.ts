import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  resultCode:number,
  resultObj:T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {

  constructor(private readonly excludedRoutes:string[] = []){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

    const request = context.switchToHttp().getRequest()
    const isExcluded = this.excludedRoutes.some(route => {
      
      return request.url.startsWith(route)
    });

    if(isExcluded){
      return next.handle()
    }

    
    return next.handle().pipe(map(data => {
        return {
            resultCode:200,
            resultObj:data
        }
    }));
  }
}