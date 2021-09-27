import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IArtist } from '../artist.model';
import { ArtistService } from '../service/artist.service';

@Component({
  templateUrl: './artist-delete-dialog.component.html',
})
export class ArtistDeleteDialogComponent {
  artist?: IArtist;

  constructor(protected artistService: ArtistService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.artistService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
