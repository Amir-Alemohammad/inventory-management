import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { AuthMessages } from "../auth/enum/auth.enum";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }
    async checkExistByUsername(username: string) {
        const user = await this.userModel.findOne({ username });
        if (user) throw new BadRequestException(AuthMessages.AlreadyExistUser)
        return user;
    }
}