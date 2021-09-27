import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { GenreDTO } from '../../service/dto/genre.dto';
import { GenreService } from '../../service/genre.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/genres')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('genres')
export class GenreController {
    logger = new Logger('GenreController');

    constructor(private readonly genreService: GenreService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: GenreDTO,
    })
    async getAll(@Req() req: Request): Promise<GenreDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.genreService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: GenreDTO,
    })
    async getOne(@Param('id') id: number): Promise<GenreDTO> {
        return await this.genreService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create genre' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: GenreDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() genreDTO: GenreDTO): Promise<GenreDTO> {
        const created = await this.genreService.save(genreDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Genre', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update genre' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: GenreDTO,
    })
    async put(@Req() req: Request, @Body() genreDTO: GenreDTO): Promise<GenreDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Genre', genreDTO.id);
        return await this.genreService.update(genreDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update genre with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: GenreDTO,
    })
    async putId(@Req() req: Request, @Body() genreDTO: GenreDTO): Promise<GenreDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Genre', genreDTO.id);
        return await this.genreService.update(genreDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete genre' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Genre', id);
        return await this.genreService.deleteById(id);
    }
}
