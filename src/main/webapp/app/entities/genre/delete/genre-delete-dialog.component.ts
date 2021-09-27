import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGenre } from '../genre.model';
import { GenreService } from '../service/genre.service';

@Component({
  templateUrl: './genre-delete-dialog.component.html',
})
export class GenreDeleteDialogComponent {
  genre?: IGenre;

  constructor(protected genreService: GenreService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.genreService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
