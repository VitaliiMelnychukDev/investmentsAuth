import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { Account1653845421620 } from './1653845421620-Account';

export class Token1654024861970 implements MigrationInterface {
  public static tableName = 'token';
  public static accountIdIndex = `index_${Token1654024861970.tableName}_accountId`;
  public static tokenIndex = `index_${Token1654024861970.tableName}_token`;
  public static accountIdForeignKey = `foreign_key_${Token1654024861970.tableName}_accountId`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const accountIdColumn = 'accountId';
    const tokenColumn = 'refreshToken';

    await queryRunner.createTable(
      new Table({
        name: Token1654024861970.tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: accountIdColumn,
            type: 'int',
          },
          {
            name: tokenColumn,
            type: 'varchar',
            length: '256',
            isUnique: true,
          },
          {
            name: 'expireAt',
            type: 'bigInt',
          },
        ],
      })
    );

    const accountIdIndex = new TableIndex({
      name: Token1654024861970.accountIdIndex,
      columnNames: [accountIdColumn],
    });

    await queryRunner.createIndex(Token1654024861970.tableName, accountIdIndex);

    const tokenIndex = new TableIndex({
      name: Token1654024861970.tokenIndex,
      columnNames: [tokenColumn],
    });

    await queryRunner.createIndex(Token1654024861970.tableName, tokenIndex);

    const accountIdForeignKey = new TableForeignKey({
      name: Token1654024861970.accountIdForeignKey,
      columnNames: [accountIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Account1653845421620.tableName,
      onDelete: 'CASCADE',
    });

    await queryRunner.createForeignKey(
      Token1654024861970.tableName,
      accountIdForeignKey
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      Token1654024861970.tableName,
      Token1654024861970.accountIdForeignKey
    );
    await queryRunner.dropIndex(
      Token1654024861970.tableName,
      Token1654024861970.tokenIndex
    );
    await queryRunner.dropIndex(
      Token1654024861970.tableName,
      Token1654024861970.accountIdIndex
    );
    await queryRunner.dropTable(Token1654024861970.tableName);
  }
}
