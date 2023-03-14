import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  async executeSeed() {

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    if(data.results.length > 0 )
      await this.pokemonModel.deleteMany({}); // delete * from pokemon
    
    // const insertPromisesArray = [];

    // data.results.forEach( ({name, url}) => {
      
    //   const segments = url.split('/');
    //   const no = Number(segments[segments.length -2]);

    //   insertPromisesArray.push(
    //     this.pokemonModel.create({name, no})
    //   );
            
    // });

    // await Promise.all(insertPromisesArray);


    const pokemonToInsert: {name: string, no: number} [] = [];

    data.results.forEach( ({name, url}) => {
      
      const segments = url.split('/');
      const no = Number(segments[segments.length -2]);

      pokemonToInsert.push({name, no});
            
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    
    return 'SEED excecuted';
  }
}
