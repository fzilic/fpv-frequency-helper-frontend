import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {Channel} from '../data/channel';
import {ApiResponse} from '../data/api-response';

@Injectable()
export class ChannelService {

  constructor(private client: HttpClient) {
  }

  readAllChannels(): Observable<ApiResponse<Array<Channel>>> {
    return this.client.get<ApiResponse<Array<Channel>>>('api/v1/channel');
  }

}
