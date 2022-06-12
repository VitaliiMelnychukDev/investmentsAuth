import {
  Action,
  createExpressServer,
  ForbiddenError,
  UnauthorizedError,
  useContainer,
} from 'routing-controllers';
import { Container } from 'typedi';
import 'reflect-metadata';

import { AccountController, AuthController } from './controllers';
import './data-source';
import { Header } from './types/request';
import { TokenService } from './services/token.service';
import { ITokenPayload } from './types/token';
import { TokenHelper } from './helpers/token.helper';

useContainer(Container);

const index = createExpressServer({
  controllers: [AccountController, AuthController],
  authorizationChecker: async (action: Action, accountRoles: string[]) => {
    const token = action.request.headers[Header.Authorization];

    if (!token) {
      throw new UnauthorizedError();
    }

    const account: ITokenPayload =
      new TokenService().verifyAndGetAccessTokenData(
        TokenHelper.parseToken(token)
      );

    if (!account) {
      throw new UnauthorizedError();
    }

    action.request.account = account;

    if (
      !accountRoles.length ||
      (accountRoles && accountRoles.includes(account.role))
    )
      return true;

    throw new ForbiddenError();
  },
});

const port = 8000;

index.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
