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
import { DeleteExpenseDto } from '../dto/delete-expense.dto';
import { ItineraryOwnerGuard } from '../guards/itinerary-owner.guard';
import { ExpensesService } from '../services/expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ItineraryOwnerGuard)
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get(':id')
  async findByItineraryId(@Param('id') id: string) {
    return this.expensesService.findByItineraryId(+id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, ItineraryOwnerGuard)
  async remove(@Body() { expense_id }: DeleteExpenseDto) {
    return this.expensesService.remove(expense_id);
  }
}
