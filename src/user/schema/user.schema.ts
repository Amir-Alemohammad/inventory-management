import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

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

    //   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
    //   items: Item[];
}

export const UserSchema = SchemaFactory.createForClass(User);
