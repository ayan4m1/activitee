import { federation } from './modules/config.js';
import { getLogger } from './modules/logging.js';
import { bindHandlers, createConnection } from './modules/rabbitmq.js';

const log = getLogger('broker');

(async () => {
  log.info(`Connecting to ${federation.instances.length} instances`);
  const instances = new Map();
  for (const instance of federation.instances) {
    const connection = await createConnection(`amqp://${instance}`);

    bindHandlers(connection, {
      download: ({ content }) => log.info(content.toString()),
      seed: ({ content }) => log.info(content.toString())
    });

    instances.set(instance, connection);
  }
})();
