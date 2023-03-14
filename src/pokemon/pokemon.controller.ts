import { Controller, Get, Post, Query, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

import { CreatePokemonDto, UpdatePokemonDto } from './dto/index';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  // @HttpCode( HttpStatus.CREATED )
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {

    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') termino: string) {
    return this.pokemonService.findOne(termino);
  }

  @Patch(':termino')
  update(@Param('termino') termino: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update(termino, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
