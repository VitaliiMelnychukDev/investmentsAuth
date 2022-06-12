import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './Account';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'int' })
  accountId: number;

  @Column({ type: 'varchar', length: 256 })
  refreshToken: string;

  @Column({ type: 'int' })
  expireAt: number;

  @ManyToOne(() => Account, (account) => account.tokens)
  account?: Account;
}
