import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {ApiResponse} from '../data/api-response';
import {Band} from '../data/band';

@Injectable()
export class BandService {

  constructor(private client: HttpClient) {
  }

  readAllBands(): Observable<ApiResponse<Array<Band>>> {
    return this.client.get<ApiResponse<Array<Band>>>('api/v1/band');
  }

}
