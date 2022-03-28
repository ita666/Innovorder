import {IsEmail, IsOptional, IsString} from "class-validator";

export class EditUserDto {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    password: string;


    constructor(email: string, firstName: string, lastName: string, password: string) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }
}
