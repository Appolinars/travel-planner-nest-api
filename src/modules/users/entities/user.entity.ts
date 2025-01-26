import { EAuthProvider } from 'src/shared/types/auth.types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    enum: EAuthProvider,
    default: EAuthProvider.DEFAULT,
  })
  provider: EAuthProvider;
}
