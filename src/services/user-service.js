import UserModel from "../models/user-model.js";
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";

import bcrypt from "bcrypt";
import uuid from "uuid";


class UserService {

    async registration(email, password) {
        const candidate = await  UserModel.findOne({email});

        if (!candidate) {
            throw new Error(`User already exists`);
        }

        const hashPassword = await bcrypt.hash(password, 7);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashPassword, activationLink});

        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink});
        if (!user) {
            throw new Error(`Incorrect activation link`);
        }
        user.isActivated = true;
        await user.save();
    }
}

export default new UserService();
