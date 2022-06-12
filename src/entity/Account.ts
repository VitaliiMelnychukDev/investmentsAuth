import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { defaultRole, AccountRole, accountRoles } from '../types/account';
import { Token } from './Token';

@Entity()
export class Account {
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
    enum: accountRoles,
    default: defaultRole,
  })
  role: AccountRole;

  @Column({ type: 'boolean', default: false })
  activated: boolean;

  @OneToMany(() => Token, (token) => token.account)
  tokens: Token[];
}
