import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Activity } from './activity.entity';
import { Expense } from './expense.entity';
import { FavoriteItinerary } from './favorite-itinerary.entity';
import { ItineraryMember } from './itinerary-member.entity';

@Entity('itineraries')
export class Itinerary {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({ type: 'varchar', array: true })
  destinations: string[];

  @OneToMany(() => ItineraryMember, (member) => member.itinerary, {
    cascade: true,
  })
  members: ItineraryMember[];

  @OneToMany(() => Activity, (activity) => activity.itinerary, {
    cascade: true,
  })
  activites: Activity[];

  @OneToMany(() => Expense, (expense) => expense.itinerary, {
    cascade: true,
  })
  expenses: Expense[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => FavoriteItinerary, (favorite) => favorite.itinerary)
  favorites: FavoriteItinerary[];
}
