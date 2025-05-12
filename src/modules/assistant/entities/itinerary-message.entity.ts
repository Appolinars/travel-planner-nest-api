import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ItineraryConversation } from './itinerary-conversation.entity';

@Entity({ name: 'itinerary_messages' })
export class ItineraryMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', select: false })
  conversation_id: number;

  @Column({ type: 'varchar', length: 20000 })
  content: string;

  @Column({ type: 'boolean' })
  is_user: boolean;

  @CreateDateColumn({
    select: false,
  })
  created_at: Date;

  @ManyToOne(() => ItineraryConversation, (convo) => convo.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: ItineraryConversation;
}
