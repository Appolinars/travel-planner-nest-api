import { User } from 'src/modules/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { Itinerary } from './itinerary.entity';

@Entity('favorite_itineraries')
export class FavoriteItinerary {
  @PrimaryColumn({ name: 'user_id', type: 'integer' })
  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryColumn({ name: 'itinerary_id', type: 'integer' })
  @ManyToOne(() => Itinerary, (itinerary) => itinerary.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @CreateDateColumn({ select: false })
  created_at: Date;
}
