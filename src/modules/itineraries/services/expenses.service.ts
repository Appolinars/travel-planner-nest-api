import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateExpenseDto } from '../dto/create-expense.dto';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expensesRepository: Repository<Expense>,
  ) {}

  create(payload: CreateExpenseDto) {
    return this.expensesRepository.save(payload);
  }

  findByItineraryId(itinerary_id: number) {
    return this.expensesRepository.find({
      where: { itinerary_id },
    });
  }

  async remove(id: string) {
    await this.expensesRepository.delete(id);
    return { success: true };
  }
}
