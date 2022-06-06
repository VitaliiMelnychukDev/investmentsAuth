import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'varchar', length: 256 })
  refreshToken: string;

  @Column({ type: 'int' })
  expireAt: number;

  @ManyToOne(() => User, (user) => user.tokens)
  user?: User;
}
