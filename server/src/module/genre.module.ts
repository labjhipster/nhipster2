import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreController } from '../web/rest/genre.controller';
import { GenreRepository } from '../repository/genre.repository';
import { GenreService } from '../service/genre.service';

@Module({
    imports: [TypeOrmModule.forFeature([GenreRepository])],
    controllers: [GenreController],
    providers: [GenreService],
    exports: [GenreService],
})
export class GenreModule {}
