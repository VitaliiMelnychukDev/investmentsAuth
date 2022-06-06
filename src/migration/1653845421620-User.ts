import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { UserRole, userRoles } from '../types/user';
import { User } from '../entity/User';
import { HashService } from '../services/hash.service';

export class User1653845421620 implements MigrationInterface {
  public static tableName = 'user';
  public static emailIndex = `index_${User1653845421620.tableName}_email`;
  public static roleIndex = `index_${User1653845421620.tableName}_role`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const emailColumn = 'email';
    const roleColumn = 'role';

    await queryRunner.createTable(
      new Table({
        name: User1653845421620.tableName,
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
            enum: userRoles,
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
      name: User1653845421620.emailIndex,
      columnNames: [emailColumn],
    });

    await queryRunner.createIndex(User1653845421620.tableName, emailIndex);

    const roleIndex = new TableIndex({
      name: User1653845421620.roleIndex,
      columnNames: [roleColumn],
    });

    await queryRunner.createIndex(User1653845421620.tableName, roleIndex);

    const hashService = new HashService();
    const userRepository = queryRunner.manager.getRepository(User);
    const defaultAdmin = new User();
    defaultAdmin.email = 'defaultadmin_user@investments.com';
    defaultAdmin.name = 'Admin Admin';
    defaultAdmin.password = await hashService.hashString('test1234');
    defaultAdmin.role = UserRole.Admin;
    defaultAdmin.activated = true;

    await userRepository.save(defaultAdmin);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      User1653845421620.tableName,
      User1653845421620.roleIndex
    );
    await queryRunner.dropIndex(
      User1653845421620.tableName,
      User1653845421620.emailIndex
    );
    await queryRunner.dropTable(User1653845421620.tableName);
  }
}
