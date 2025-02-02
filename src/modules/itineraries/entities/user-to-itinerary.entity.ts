import { Itinerary } from 'src/modules/itineraries/entities/itinerary.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { EItineraryUserRole } from '../types/itineraries.types';

@Entity('users_to_itinerary')
@Unique(['userId', 'itineraryId']) // Ensures one record per user + itinerary
export class UserToItinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  itineraryId: number;

  @Column({
    type: 'enum',
    enum: EItineraryUserRole,
    default: EItineraryUserRole.MEMBER,
  })
  role: EItineraryUserRole;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Itinerary, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itineraryId' })
  itinerary: Itinerary;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
