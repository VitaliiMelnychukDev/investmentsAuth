import { DataSource } from 'typeorm';
import { join } from 'path';
import { Account } from './entity/Account';
import { Token } from './entity/Token';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'test1234',
  database: 'auth',
  entities: [Account, Token],
  migrations: [join(__dirname, '/migration/*.{ts,js}')],
  synchronize: false,
});

AppDataSource.initialize()
  .then(() => console.log('DB successfully initialized'))
  .catch((error) => console.log(error));

export default AppDataSource;
