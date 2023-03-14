import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose/dist';
import { Document } from 'mongoose';


@Schema()
export class Pokemon extends Document {

    // id: string  // Mongo me lo da
    
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number;
}


export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
