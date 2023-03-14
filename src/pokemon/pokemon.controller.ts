import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

import { CreatePokemonDto, UpdatePokemonDto } from './dto/index';
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
  findAll() {
    return this.pokemonService.findAll();
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
