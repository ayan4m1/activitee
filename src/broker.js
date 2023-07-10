import { federation } from './modules/config.js';
import { getLogger } from './modules/logging.js';
import {
  bindHandlers,
  createConnection,
  createLocalConnection,
  dispatch
} from './modules/rabbitmq.js';

const log = getLogger('broker');

(async () => {
  log.info('Connecting to localhost');
  const localConn = await createLocalConnection();

  log.info(`Connecting to ${federation.instances.length} instances`);
  const instances = new Map();

  for (const instanceUrl of federation.instances) {
    const hostname = instanceUrl.substring(instanceUrl.lastIndexOf('@') + 1);
    const connection = await createConnection(`amqp://${instanceUrl}`);

    if (!connection) {
      continue;
    }

    // listen for publish messages from other instance, send them to torrenter
    bindHandlers(
      connection,
      {
        infoHash: ({ content }) => {
          log.info(`${hostname} sent us infohash ${content.toString()}`);
          dispatch(localConn, `${hostname}:download`, content);
        }
      },
      hostname
    );

    instances.set(hostname, connection);
  }

  // listen for broadcast messages from generator, forward them to all instances
  bindHandlers(
    localConn,
    {
      infoHash: ({ content }) =>
        dispatch(localConn, `${federation.hostname}:download`, content)
    },
    federation.hostname
  );
})();
