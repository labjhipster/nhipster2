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
import { AlbumDTO } from '../../service/dto/album.dto';
import { AlbumService } from '../../service/album.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/albums')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('albums')
export class AlbumController {
    logger = new Logger('AlbumController');

    constructor(private readonly albumService: AlbumService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: AlbumDTO,
    })
    async getAll(@Req() req: Request): Promise<AlbumDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.albumService.findAndCount({
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
        type: AlbumDTO,
    })
    async getOne(@Param('id') id: number): Promise<AlbumDTO> {
        return await this.albumService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create album' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AlbumDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() albumDTO: AlbumDTO): Promise<AlbumDTO> {
        const created = await this.albumService.save(albumDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Album', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update album' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AlbumDTO,
    })
    async put(@Req() req: Request, @Body() albumDTO: AlbumDTO): Promise<AlbumDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Album', albumDTO.id);
        return await this.albumService.update(albumDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update album with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AlbumDTO,
    })
    async putId(@Req() req: Request, @Body() albumDTO: AlbumDTO): Promise<AlbumDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Album', albumDTO.id);
        return await this.albumService.update(albumDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete album' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Album', id);
        return await this.albumService.deleteById(id);
    }
}
