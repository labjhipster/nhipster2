import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'artist',
        data: { pageTitle: 'bootifulmusicApp.artist.home.title' },
        loadChildren: () => import('./artist/artist.module').then(m => m.ArtistModule),
      },
      {
        path: 'genre',
        data: { pageTitle: 'bootifulmusicApp.genre.home.title' },
        loadChildren: () => import('./genre/genre.module').then(m => m.GenreModule),
      },
      {
        path: 'track',
        data: { pageTitle: 'bootifulmusicApp.track.home.title' },
        loadChildren: () => import('./track/track.module').then(m => m.TrackModule),
      },
      {
        path: 'album',
        data: { pageTitle: 'bootifulmusicApp.album.home.title' },
        loadChildren: () => import('./album/album.module').then(m => m.AlbumModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
