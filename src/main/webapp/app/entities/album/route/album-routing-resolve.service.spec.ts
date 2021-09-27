jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAlbum, Album } from '../album.model';
import { AlbumService } from '../service/album.service';

import { AlbumRoutingResolveService } from './album-routing-resolve.service';

describe('Service Tests', () => {
  describe('Album routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AlbumRoutingResolveService;
    let service: AlbumService;
    let resultAlbum: IAlbum | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AlbumRoutingResolveService);
      service = TestBed.inject(AlbumService);
      resultAlbum = undefined;
    });

    describe('resolve', () => {
      it('should return IAlbum returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAlbum = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAlbum).toEqual({ id: 123 });
      });

      it('should return new IAlbum if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAlbum = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAlbum).toEqual(new Album());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAlbum = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAlbum).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
