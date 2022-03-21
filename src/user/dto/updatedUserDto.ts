import {IsEmail, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UpdatedUserDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    token: string;


    constructor(id: number, email: string, firstName: string, lastName: string, token: string) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.token = token;
    }
}
