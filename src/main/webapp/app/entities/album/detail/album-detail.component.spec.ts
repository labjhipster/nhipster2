import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AlbumDetailComponent } from './album-detail.component';

describe('Component Tests', () => {
  describe('Album Management Detail Component', () => {
    let comp: AlbumDetailComponent;
    let fixture: ComponentFixture<AlbumDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AlbumDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ album: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AlbumDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AlbumDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load album on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.album).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
