import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITrack, getTrackIdentifier } from '../track.model';

export type EntityResponseType = HttpResponse<ITrack>;
export type EntityArrayResponseType = HttpResponse<ITrack[]>;

@Injectable({ providedIn: 'root' })
export class TrackService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/tracks');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(track: ITrack): Observable<EntityResponseType> {
    return this.http.post<ITrack>(this.resourceUrl, track, { observe: 'response' });
  }

  update(track: ITrack): Observable<EntityResponseType> {
    return this.http.put<ITrack>(`${this.resourceUrl}/${getTrackIdentifier(track) as number}`, track, { observe: 'response' });
  }

  partialUpdate(track: ITrack): Observable<EntityResponseType> {
    return this.http.patch<ITrack>(`${this.resourceUrl}/${getTrackIdentifier(track) as number}`, track, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITrack>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITrack[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTrackToCollectionIfMissing(trackCollection: ITrack[], ...tracksToCheck: (ITrack | null | undefined)[]): ITrack[] {
    const tracks: ITrack[] = tracksToCheck.filter(isPresent);
    if (tracks.length > 0) {
      const trackCollectionIdentifiers = trackCollection.map(trackItem => getTrackIdentifier(trackItem)!);
      const tracksToAdd = tracks.filter(trackItem => {
        const trackIdentifier = getTrackIdentifier(trackItem);
        if (trackIdentifier == null || trackCollectionIdentifiers.includes(trackIdentifier)) {
          return false;
        }
        trackCollectionIdentifiers.push(trackIdentifier);
        return true;
      });
      return [...tracksToAdd, ...trackCollection];
    }
    return trackCollection;
  }
}
