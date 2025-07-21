import { ApiProperty } from "@nestjs/swagger";
import { ArrayUnique, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";

export class updateProductDto {
    @ApiProperty({ example: 'Air Jordan 5', description: 'Название товара' })
    @IsString()
    name?: string

    @IsString()
    @ApiProperty({ example: 'Стильные модные кроссовки', description: 'Описание товара' })
    description?: string

    @IsNumber()
    @Min(0)
    @ApiProperty({ example: 899.00, description: 'Цена товара' })
    price?: number;

    @IsString()
    @ApiProperty({ example: 'Nike', description: 'Бренд товара' })
    brand?: string

    @IsString()
    @ApiProperty({ example: 'Кроссовки', description: 'Тип товара' })
    type?: string

    @IsArray()
    @IsNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    @ApiProperty({ example: ['Черный', 'Белый'], description: 'Цвет товара' })
    colors?: string[];

    @IsArray()
    @IsNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    @ApiProperty({ example: ["45", "46", "47"], description: 'Размер товара' })
    size?: string[];
    
    @IsInt()
    @ApiProperty({ example: 1, description: 'Категория товара' })
    categoriesId?: number;
} 