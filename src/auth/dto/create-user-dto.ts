import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsPhoneNumber('RU')
    @ApiProperty({ example: '+79201234567', description: 'Номер телефона' })
    phone: string

    @IsString()
    @MinLength(8)
    @ApiProperty({ example: 'Qwerty124343', description: 'Пароль' })
    password: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
    name: string

    @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
        message: 'Дата должна быть в формате YYYY-MM-DD, месяц 01-12, день 01-31',
    })
    @ApiProperty({ example: '1982-12-31', description: 'День рождения' })
    dob: string

    @IsString()
    @ApiProperty({ example: 'Moscow', description: 'Город доставки' })
    sity: string
}