import { Service } from 'typedi';
import { Account } from '../entity/Account';
import kafka from '../kafka';
import { Topic } from '../types/kafka';
import { BadRequestError } from 'routing-controllers';
import { AccountError } from '../types/error';

@Service()
export class AccountProducer {
  public async userRegistered(account: Account): Promise<void> {
    const producer = kafka.producer();

    try {
      await producer.connect();
      await producer.send({
        topic: Topic.Accounts,
        messages: [
          {
            key: `account_${account.id}`,
            value: JSON.stringify({
              id: account.id,
              name: account.name,
              email: account.email,
              role: account.role,
            }),
          },
        ],
      });

      await producer.disconnect();
    } catch {
      throw new BadRequestError(AccountError.SendAccountRegisteredEventFail);
    }
  }
}
