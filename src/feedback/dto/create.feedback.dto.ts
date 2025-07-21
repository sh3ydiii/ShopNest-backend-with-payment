import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class FeedbackDto {
    @IsString()
    @ApiProperty({ example: 'Помогите с доставкой', description: 'Текст с вопросом' })
    message: string

    @IsEmail()
    @ApiProperty({ example: 'example@gmail.com', description: 'Email для ответа' })
    email: string
}