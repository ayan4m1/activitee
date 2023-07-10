import { FlushBucket } from './modules/flushBucket.js';
import { getLogger } from './modules/logging.js';
import { createConnection, dispatch } from './modules/rabbitmq.js';
import { federation } from './modules/config.js';

const log = getLogger('generator');
const conn = await createConnection('amqp://localhost');

log.info('Starting periodic flush of data');
const bucket = new FlushBucket((items) =>
  dispatch(
    conn,
    `${federation.hostname}:publish`,
    Buffer.from(JSON.stringify(items), 'utf-8')
  )
);

bucket.flushIntervalSec = 60;
bucket.start();
setInterval(
  () => bucket.pushItem({ value: Math.random() }),
  Math.ceil(Math.random() * 50)
);
