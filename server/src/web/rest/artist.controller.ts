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
import { ArtistDTO } from '../../service/dto/artist.dto';
import { ArtistService } from '../../service/artist.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/artists')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('artists')
export class ArtistController {
    logger = new Logger('ArtistController');

    constructor(private readonly artistService: ArtistService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ArtistDTO,
    })
    async getAll(@Req() req: Request): Promise<ArtistDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.artistService.findAndCount({
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
        type: ArtistDTO,
    })
    async getOne(@Param('id') id: number): Promise<ArtistDTO> {
        return await this.artistService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create artist' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ArtistDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() artistDTO: ArtistDTO): Promise<ArtistDTO> {
        const created = await this.artistService.save(artistDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Artist', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update artist' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ArtistDTO,
    })
    async put(@Req() req: Request, @Body() artistDTO: ArtistDTO): Promise<ArtistDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Artist', artistDTO.id);
        return await this.artistService.update(artistDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update artist with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ArtistDTO,
    })
    async putId(@Req() req: Request, @Body() artistDTO: ArtistDTO): Promise<ArtistDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Artist', artistDTO.id);
        return await this.artistService.update(artistDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete artist' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Artist', id);
        return await this.artistService.deleteById(id);
    }
}
