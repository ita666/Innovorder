//I decided not to use this DTO but the Prisma type for handling user data.

import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class UserDto {
    @IsEmail()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}
