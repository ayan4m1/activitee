import { federation } from './modules/config.js';
import { getLogger } from './modules/logging.js';
import {
  bindHandlers,
  createConnection,
  dispatch
} from './modules/rabbitmq.js';

const log = getLogger('broker');

(async () => {
  log.info('Connecting to localhost');
  const localConn = await createConnection(`amqp://localhost`);
  log.info(`Connecting to ${federation.instances.length} instances`);
  const instances = new Map();
  for (const instance of federation.instances) {
    const connection = await createConnection(`amqp://${instance}`);

    // listen for publish messages from other instance, send them to torrenter
    bindHandlers(connection, {
      publish: ({ content }) => dispatch(localConn, 'download', content)
    });

    instances.set(instance, connection);
  }

  // listen for broadcast messages from generator, forward them to all instances
  bindHandlers(localConn, {
    publish: ({ content }) => {
      for (const connection of instances.values()) {
        dispatch(connection, 'publish', content);
      }
    }
  });
})();
