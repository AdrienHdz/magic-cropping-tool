import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http'
import { IUploadedImage } from '../interfaces/uploadedImage.interface';

export enum FetchingServerState {
  FETCHING = 1,
  DONE = 2
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:8000";

  private _image = new ReplaySubject<Blob>();
  public image_prediction: Observable<Blob> = this._image.asObservable()

  private _fetchingState: BehaviorSubject<FetchingServerState> = new BehaviorSubject<FetchingServerState>(FetchingServerState.DONE);
  public fetchingState: Observable<FetchingServerState> = this._fetchingState.asObservable();


  constructor(private httpClient: HttpClient) { }

  
  public detectClick(uploadedImage: IUploadedImage):void {
    console.log('clicked')
    this.getImagePrediction(uploadedImage)
  }

  public static httpParameters(formSizes:IUploadedImage): HttpParams {
    let httpParams = new HttpParams();
    if (formSizes.width) {
      httpParams = httpParams.append('width', Number(formSizes.width))
    }
    if (formSizes.height) {
      httpParams = httpParams.append('height', Number(formSizes.height))
    }
    return httpParams;
  }

  private getImagePrediction(image: IUploadedImage): void {
    this._fetchingState.next(FetchingServerState.FETCHING)
    const data= new FormData();
    data.append('file', image.file as Blob, image.file!.name as string)
    this.httpClient.post(this.REST_API_SERVER + '/image', data, {
      responseType: 'blob',
      params: DataService.httpParameters(image)
    })
    .subscribe({
      next: (image: Blob) => {
        this._image.next(image)
        this._fetchingState.next(FetchingServerState.DONE)
      },
    })
  } 
}
