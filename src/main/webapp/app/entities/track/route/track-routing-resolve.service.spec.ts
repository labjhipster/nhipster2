jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITrack, Track } from '../track.model';
import { TrackService } from '../service/track.service';

import { TrackRoutingResolveService } from './track-routing-resolve.service';

describe('Service Tests', () => {
  describe('Track routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TrackRoutingResolveService;
    let service: TrackService;
    let resultTrack: ITrack | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TrackRoutingResolveService);
      service = TestBed.inject(TrackService);
      resultTrack = undefined;
    });

    describe('resolve', () => {
      it('should return ITrack returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTrack = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTrack).toEqual({ id: 123 });
      });

      it('should return new ITrack if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTrack = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTrack).toEqual(new Track());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTrack = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTrack).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
