import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { User1653845421620 } from './1653845421620-User';

export class Token1654024861970 implements MigrationInterface {
  public static tableName = 'token';
  public static userIdIndex = `index_${Token1654024861970.tableName}_userId`;
  public static tokenIndex = `index_${Token1654024861970.tableName}_token`;
  public static userIdForeignKey = `foreign_key_${Token1654024861970.tableName}_userId`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userIdColumn = 'userId';
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
            name: userIdColumn,
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

    const userIdIndex = new TableIndex({
      name: Token1654024861970.userIdIndex,
      columnNames: [userIdColumn],
    });

    await queryRunner.createIndex(Token1654024861970.tableName, userIdIndex);

    const tokenIndex = new TableIndex({
      name: Token1654024861970.tokenIndex,
      columnNames: [tokenColumn],
    });

    await queryRunner.createIndex(Token1654024861970.tableName, tokenIndex);

    const userIdForeignKey = new TableForeignKey({
      name: Token1654024861970.userIdForeignKey,
      columnNames: [userIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: User1653845421620.tableName,
      onDelete: 'CASCADE',
    });

    await queryRunner.createForeignKey(
      Token1654024861970.tableName,
      userIdForeignKey
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      Token1654024861970.tableName,
      Token1654024861970.userIdForeignKey
    );
    await queryRunner.dropIndex(
      Token1654024861970.tableName,
      Token1654024861970.tokenIndex
    );
    await queryRunner.dropIndex(
      Token1654024861970.tableName,
      Token1654024861970.userIdIndex
    );
    await queryRunner.dropTable(Token1654024861970.tableName);
  }
}
