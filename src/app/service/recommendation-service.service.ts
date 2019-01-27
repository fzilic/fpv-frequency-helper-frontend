import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Pilot} from '../data/pilot';
import {Observable} from 'rxjs';
import {ApiResponse} from '../data/api-response';
import {FrequencySelectionRequest} from '../data/frequency-selection-request';
import {RecommendationResult} from '../data/recommendation-result';

@Injectable()
export class RecommendationServiceService {

  constructor(private httpClient: HttpClient) {
  }

  getRecommendations(pilots: Array<Pilot>): Observable<ApiResponse<Array<RecommendationResult>>> {
    const request = new FrequencySelectionRequest();
    request.pilots = pilots;
    request.minimumSeparation = 20;

    request.pilots.forEach(value => value.availableChannels.forEach(value1 => value1.band = null));

    return this.httpClient.post<ApiResponse<Array<RecommendationResult>>>('/api/v1/frequency', request);
  }

}
