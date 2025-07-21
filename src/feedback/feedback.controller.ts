import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { RolesGuard } from 'src/guard/role.guard';
import { Roles } from 'src/guard/roles.decorator';
import { FeedbackDto } from './dto/create.feedback.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface FeedbacksRequest extends Request {
  user: {
    userId: number,
    phone: string,
    role: string
  }
}
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Получение обращений' })
  @ApiResponse({
  status: 200,
  description: 'Кейсы сайта',
  schema: {
      example: {
        "feedbacks": [
          {
              "id": 1,
              "userId": 2,
              "message": "Где мой товар ???",
              "email": "richelite@gmail.com",
              "status": "NEW",
              "createdAt": "2025-07-21T19:31:27.606Z"
          }
      ]
      }
  }
  })
  async getAllFeedback() {
    const feedbacks = await this.feedbackService.getFeedbacks()

    return {
      feedbacks: feedbacks
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создать обращение' })
  @ApiResponse({
  status: 200,
  description: 'Кейсы сайта',
  schema: {
      example: {
        "id": 1,
        "userId": 2,
        "message": "Где мой товар ???",
        "email": "richelite@gmail.com",
        "status": "NEW",
        "createdAt": "2025-07-21T19:31:27.606Z"
      }
  }
  })
  @ApiBody({
    description: 'Данные для создания обращения',
    type: FeedbackDto,
    examples: {
      example1: {
        value: {
          message: 'Где мой товар ???',
          email: "rishelite@gmail.com"
        }
      }
    }
  })
  async createFeedback(@Req() req: FeedbacksRequest, @Body() data: FeedbackDto) {
    const feedback = await this.feedbackService.createFeedback(req.user.userId, data)

    return feedback
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Обновить обращение' })
  @ApiResponse({
  status: 200,
  description: 'Данные обновленного обращения',
  schema: {
      example: {
        "id": 1,
        "userId": 2,
        "message": "Где мой товар ???",
        "email": "richelite@gmail.com",
        "status": "RESOLVED",
        "createdAt": "2025-07-21T19:31:27.606Z"
      }
  }
  })
  @ApiBody({
    description: 'Обновление статуса обращения',
    type: String,
    examples: {
      example1: {
        value: 'RESOLVED'
      },
      example2: {
        value: 'In_PROGRESS'
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateFeedback(@Param('id', ParseIntPipe) id: number, @Body('status') status: string) {
    const feedback = await this.feedbackService.updateFeedback(id, status)

    return {
      feedback: feedback
    }
  }
}
