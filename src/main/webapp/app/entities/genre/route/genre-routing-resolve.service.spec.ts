jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IGenre, Genre } from '../genre.model';
import { GenreService } from '../service/genre.service';

import { GenreRoutingResolveService } from './genre-routing-resolve.service';

describe('Service Tests', () => {
  describe('Genre routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: GenreRoutingResolveService;
    let service: GenreService;
    let resultGenre: IGenre | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(GenreRoutingResolveService);
      service = TestBed.inject(GenreService);
      resultGenre = undefined;
    });

    describe('resolve', () => {
      it('should return IGenre returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGenre = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGenre).toEqual({ id: 123 });
      });

      it('should return new IGenre if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGenre = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultGenre).toEqual(new Genre());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGenre = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGenre).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
