// import jsonfile from 'jsonfile';

// import { FlushBucket } from './modules/flushBucket.js';
import { createTorrent, downloadTorrent, resume } from './modules/bt.js';
import { getLogger } from './modules/logging.js';
import { bindHandlers, createConnection } from './modules/rabbitmq.js';

// const { writeFile } = jsonfile;
const log = getLogger('torrenter');
const conn = await createConnection('amqp://localhost');

(async () => {
  log.info('Listening to RabbitMQ messages');
  bindHandlers(conn, {
    download: ({ content }) => downloadTorrent(content.toString()),
    seed: ({ content }) => createTorrent(content)
  });

  log.info('Seeding existing torrents');
  resume();

  // log.info('Starting periodic flush of data');
  // const bucket = new FlushBucket((items) =>
  //   writeFile(`./${Date.now()}.json`, items)
  // );
  // bucket.start();
  // setInterval(
  //   () => bucket.pushItem({ value: Math.random() }),
  //   Math.ceil(Math.random() * 100)
  // );
})();
