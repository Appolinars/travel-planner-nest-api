import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ItineraryMessage } from './itinerary-message.entity';

@Entity({ name: 'itinerary_conversations' })
export class ItineraryConversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', select: false })
  itinerary_id: number;

  @Column({ type: 'integer', select: false })
  user_id: number;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.itinerary_conversations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ItineraryMessage, (message) => message.conversation)
  messages: ItineraryMessage[];
}
