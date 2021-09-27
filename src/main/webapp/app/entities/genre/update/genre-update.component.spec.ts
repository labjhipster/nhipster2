jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GenreService } from '../service/genre.service';
import { IGenre, Genre } from '../genre.model';

import { GenreUpdateComponent } from './genre-update.component';

describe('Component Tests', () => {
  describe('Genre Management Update Component', () => {
    let comp: GenreUpdateComponent;
    let fixture: ComponentFixture<GenreUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let genreService: GenreService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GenreUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(GenreUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GenreUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      genreService = TestBed.inject(GenreService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const genre: IGenre = { id: 456 };

        activatedRoute.data = of({ genre });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(genre));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const genre = { id: 123 };
        spyOn(genreService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ genre });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: genre }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(genreService.update).toHaveBeenCalledWith(genre);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const genre = new Genre();
        spyOn(genreService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ genre });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: genre }));
        saveSubject.complete();

        // THEN
        expect(genreService.create).toHaveBeenCalledWith(genre);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const genre = { id: 123 };
        spyOn(genreService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ genre });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(genreService.update).toHaveBeenCalledWith(genre);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
