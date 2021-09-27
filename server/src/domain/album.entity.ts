/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Artist } from './artist.entity';
import { Genre } from './genre.entity';
import { Track } from './track.entity';

/**
 * A Album.
 */
@Entity('album')
export class Album extends BaseEntity {
    @Column({ name: 'name' })
    name: string;

    @OneToOne(type => Artist)
    @JoinColumn()
    artist: Artist;

    @OneToOne(type => Genre)
    @JoinColumn()
    genre: Genre;

    @OneToMany(
        type => Track,
        other => other.album,
    )
    tracks: Track[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
