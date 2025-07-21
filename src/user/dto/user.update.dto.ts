import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, Matches } from "class-validator";

export class UpdateDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Александр', description: 'Имя пользователя'})
    name: string

    @IsOptional()
    @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
        message: 'Дата должна быть в формате YYYY-MM-DD, месяц 01-12, день 01-31',
    })
    @ApiProperty({ example: '1990-12-14', description: 'Дата рождения'})
    dob: string

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Moscow', description: 'Город доставки'})
    sity: string
}