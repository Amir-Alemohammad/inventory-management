import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { now } from "mongoose";
import { User } from "../../user/schema/user.schema";

@Schema()
export class Item {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    quantity: number;
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    user: User;
    @Prop({ default: now() })
    createdAt: Date;
    @Prop({ default: now() })
    updatedAt: Date;
}
export const ItemSchema = SchemaFactory.createForClass(Item);