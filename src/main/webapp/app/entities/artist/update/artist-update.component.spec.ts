jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ArtistService } from '../service/artist.service';
import { IArtist, Artist } from '../artist.model';

import { ArtistUpdateComponent } from './artist-update.component';

describe('Component Tests', () => {
  describe('Artist Management Update Component', () => {
    let comp: ArtistUpdateComponent;
    let fixture: ComponentFixture<ArtistUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let artistService: ArtistService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ArtistUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ArtistUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArtistUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      artistService = TestBed.inject(ArtistService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const artist: IArtist = { id: 456 };

        activatedRoute.data = of({ artist });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(artist));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const artist = { id: 123 };
        spyOn(artistService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ artist });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: artist }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(artistService.update).toHaveBeenCalledWith(artist);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const artist = new Artist();
        spyOn(artistService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ artist });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: artist }));
        saveSubject.complete();

        // THEN
        expect(artistService.create).toHaveBeenCalledWith(artist);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const artist = { id: 123 };
        spyOn(artistService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ artist });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(artistService.update).toHaveBeenCalledWith(artist);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
