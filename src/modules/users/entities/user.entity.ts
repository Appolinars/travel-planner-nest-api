import { ItineraryConversation } from 'src/modules/assistant/entities/itinerary-conversation.entity';
import { FavoriteItinerary } from 'src/modules/itineraries/entities/favorite-itinerary.entity';
import { EAuthProvider, EUserRole } from 'src/shared/types/auth.types';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 254 })
  email: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 200, nullable: true, select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: EUserRole,
    default: EUserRole.USER,
  })
  role: EUserRole;

  @Column({
    type: 'enum',
    enum: EAuthProvider,
    default: EAuthProvider.DEFAULT,
  })
  provider: EAuthProvider;

  @OneToMany(() => FavoriteItinerary, (favorite) => favorite.user)
  favorites: FavoriteItinerary[];

  @OneToMany(() => ItineraryConversation, (conversation) => conversation.user)
  itinerary_conversations: ItineraryConversation[];
}
