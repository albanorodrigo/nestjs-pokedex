import { Injectable } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto, UpdatePokemonDto } from './dto/index';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);  
      return pokemon;
    } catch (error) {
      this.handleExeptions(error);
    }
    
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(termino: string) {

    let pokemon: Pokemon;

    // Busqueda por "no"
    if(!isNaN(+termino))
      pokemon = await this.pokemonModel.findOne({no: termino});

    // Busqueda por MongoID
    if(!pokemon && isValidObjectId(termino))
      pokemon = await this.pokemonModel.findById(termino);

    // Busqueda por Name
    if(!pokemon)
    pokemon = await this.pokemonModel.findOne({name: termino.toLocaleLowerCase()});

    if(!pokemon)
      throw new NotFoundException(`Pokemon with id, no or name "${termino}" not found`);

    return pokemon;
  }

  async update(termino: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(termino);
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExeptions(error);
    }
    
  }

  async remove(id: string) {
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with ID "${id}" not found`);
    
    return;
  }


  private handleExeptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in DB - ${ JSON.stringify(error.keyValue) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't update Pokemon - Check server logs`);
  }
}
