import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { defaultRole, UserRole, userRoles } from '../types/user';
import { Token } from './Token';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
    unique: true,
  })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  name: string;

  @Column({ type: 'varchar', length: 256 })
  password: string;

  @Column({
    type: 'enum',
    enum: userRoles,
    default: defaultRole,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  activated: boolean;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
