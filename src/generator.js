import { FlushBucket } from './modules/flushBucket.js';
import { getLogger } from './modules/logging.js';
import { createConnection, dispatch } from './modules/rabbitmq.js';

const log = getLogger('generator');
const conn = await createConnection('amqp://localhost');

log.info('Starting periodic flush of data');
const bucket = new FlushBucket((items) =>
  dispatch(conn, 'publish', Buffer.from(JSON.stringify(items), 'utf-8'))
);

bucket.start();
setInterval(
  () => bucket.pushItem({ value: Math.random() }),
  Math.ceil(Math.random() * 100)
);