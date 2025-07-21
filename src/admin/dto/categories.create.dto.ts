import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

class CreateCategoriesDto {
    @ApiProperty({ example: 'Кроссовки', description: 'Название категории' })
    @IsString()
    name: string
}

class UpdateCategoriesDto {
    @ApiProperty({ example: 'Обувь', description: 'Название категории' })
    @IsString()
    name: string
}

export {
    CreateCategoriesDto,
    UpdateCategoriesDto
}