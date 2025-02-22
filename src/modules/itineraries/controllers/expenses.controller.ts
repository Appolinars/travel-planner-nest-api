import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

import { CreateExpenseDto } from '../dto/create-expense.dto';
import { ExpensesService } from '../services/expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get(':id')
  async findByItineraryId(@Param('id') id: string) {
    return this.expensesService.findByItineraryId(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
