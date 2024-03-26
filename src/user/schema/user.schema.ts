import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now } from 'mongoose';
import { Item } from 'src/items/schema/item.schema';

@Schema()
export class User {
    @Prop({ unique: true, required: true })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: false })
    access_token: string;
    @Prop({ required: false })
    refresh_token: string;
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
    items: Item[];
    @Prop({ default: now() })
    createdAt: Date;
    @Prop({ default: now() })
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
