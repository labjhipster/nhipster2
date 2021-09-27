/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Album } from './album.entity';

/**
 * A Track.
 */
@Entity('track')
export class Track extends BaseEntity {
    @Column({ name: 'name' })
    name: string;

    @ManyToOne(type => Album)
    album: Album;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
