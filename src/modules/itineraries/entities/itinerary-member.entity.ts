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

import { EItineraryMemberRole } from '../types/itineraries.types';

@Entity('itinerary_members')
@Unique(['user_id', 'itinerary_id']) // Ensures one record per user + itinerary
export class ItineraryMember {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer' })
  user_id: number;

  @Column({ type: 'integer' })
  itinerary_id: number;

  @Column({
    type: 'enum',
    enum: EItineraryMemberRole,
    default: EItineraryMemberRole.MEMBER,
  })
  role: EItineraryMemberRole;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Itinerary, (itinerary) => itinerary.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
