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

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'varchar', length: 200 })
  location: string;

  @Column({ type: 'integer', select: false })
  itinerary_id: number;

  @ManyToOne(() => Itinerary, (itinerary) => itinerary.activites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itinerary_id' })
  itinerary: Itinerary;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}
