import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class AddRateDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Хороший товар', description: 'Отзыв о товаре' })
    comment: string

    @IsNumber()
    @ApiProperty({ example: 4, description: 'Оценка товара'})
    value: number
}