import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsPhoneNumber('RU')
    @ApiProperty({ example: '+71234567890', description: 'Номер телефона' })
    phone: string

    @IsString()
    @MinLength(8)
    @ApiProperty({ example: 'EDDDSDSD', description: 'Пароль' })
    password:string
}