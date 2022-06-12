import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { AccountRole, accountRoles } from '../types/account';
import { Account } from '../entity/Account';
import { HashService } from '../services/hash.service';

export class Account1653845421620 implements MigrationInterface {
  public static tableName = 'account';
  public static emailIndex = `index_${Account1653845421620.tableName}_email`;
  public static roleIndex = `index_${Account1653845421620.tableName}_role`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const emailColumn = 'email';
    const roleColumn = 'role';

    await queryRunner.createTable(
      new Table({
        name: Account1653845421620.tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: emailColumn,
            type: 'varchar',
            length: '256',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '256',
          },
          {
            name: roleColumn,
            type: 'enum',
            enum: accountRoles,
          },
          {
            name: 'activated',
            type: 'boolean',
            default: false,
          },
        ],
      })
    );

    const emailIndex = new TableIndex({
      name: Account1653845421620.emailIndex,
      columnNames: [emailColumn],
    });

    await queryRunner.createIndex(Account1653845421620.tableName, emailIndex);

    const roleIndex = new TableIndex({
      name: Account1653845421620.roleIndex,
      columnNames: [roleColumn],
    });

    await queryRunner.createIndex(Account1653845421620.tableName, roleIndex);

    const hashService = new HashService();
    const accountRepository = queryRunner.manager.getRepository(Account);
    const defaultAdmin = new Account();
    defaultAdmin.email = 'defaultadmin_user@investments.com';
    defaultAdmin.name = 'Admin Admin';
    defaultAdmin.password = await hashService.hashString('test1234');
    defaultAdmin.role = AccountRole.Admin;
    defaultAdmin.activated = true;

    await accountRepository.save(defaultAdmin);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      Account1653845421620.tableName,
      Account1653845421620.roleIndex
    );
    await queryRunner.dropIndex(
      Account1653845421620.tableName,
      Account1653845421620.emailIndex
    );
    await queryRunner.dropTable(Account1653845421620.tableName);
  }
}
