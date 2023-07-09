// import jsonfile from 'jsonfile';

// import { FlushBucket } from './modules/flushBucket.js';
import { createTorrent, downloadTorrent, resume } from './modules/bt.js';
import { getLogger } from './modules/logging.js';
import { bindHandlers } from './modules/rabbitmq.js';

// const { writeFile } = jsonfile;
const log = getLogger('app');

(async () => {
  log.info('Listening to RabbitMQ messages');
  bindHandlers(
    ({ content }) => downloadTorrent(content.toString()),
    ({ content }) => createTorrent(content)
  );
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
