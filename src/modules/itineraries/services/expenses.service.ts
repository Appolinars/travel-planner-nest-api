import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { CreateExpenseDto } from '../dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly dataSource: DataSource) {}

  async create(payload: CreateExpenseDto) {
    const { itinerary_id, title, amount, currency, notes } = payload;
    const query = `
      INSERT INTO expenses (itinerary_id, title, amount, currency, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await this.dataSource.query(query, [
      itinerary_id,
      title,
      amount,
      currency,
      notes,
    ]);

    return result[0];
  }

  async findByItineraryId(itinerary_id: number) {
    const query = `
      SELECT * FROM expenses
      WHERE itinerary_id = $1;
    `;
    return await this.dataSource.query(query, [itinerary_id]);
  }

  async remove(id: string) {
    const query = `
      DELETE FROM expenses
      WHERE id = $1;
    `;
    await this.dataSource.query(query, [id]);
    return { success: true };
  }
}

// @Injectable()
// export class ExpensesService {
//   constructor(
//     @InjectRepository(Expense)
//     private readonly expensesRepository: Repository<Expense>,
//   ) {}

//   create(payload: CreateExpenseDto) {
//     return this.expensesRepository.save(payload);
//   }

//   findByItineraryId(itinerary_id: number) {
//     return this.expensesRepository.find({
//       where: { itinerary_id },
//     });
//   }

//   async remove(id: string) {
//     await this.expensesRepository.delete(id);
//     return { success: true };
//   }
// }
