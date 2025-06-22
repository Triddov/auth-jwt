import bcrypt from "bcrypt";
import uuid from "uuid";

import UserModel from "../models/user-model.js";
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserDto from "../dtos/user-dto.js";
import ApiError from "../exceptions/api-error.js";


class UserService {

    async registration(email, password) {
        const candidate = await  UserModel.findOne({email});

        if (!candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exists`);
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
            throw ApiError.BadRequest(`Incorrect activation link ${activationLink}`);
        }
        user.isActivated = true;
        await user.save();
    }
}

export default new UserService();
