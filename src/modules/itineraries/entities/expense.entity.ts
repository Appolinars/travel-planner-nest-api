import { Itinerary } from 'src/modules/itineraries/entities/itinerary.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 6,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount: number;

  @Column({ type: 'varchar', length: 10 })
  currency: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  notes?: string;

  @Column({ type: 'integer', select: false })
  itinerary_id: number;

  @ManyToOne(() => Itinerary, (itinerary) => itinerary.expenses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
