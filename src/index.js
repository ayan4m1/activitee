import { federation } from './modules/config.js';
import { createTorrent, downloadTorrent, resume } from './modules/bt.js';
import { getLogger } from './modules/logging.js';
import { bindHandlers, createConnection } from './modules/rabbitmq.js';

const log = getLogger('torrenter');
const conn = await createConnection('amqp://localhost');

(async () => {
  log.info('Listening to RabbitMQ messages');
  bindHandlers(
    conn,
    {
      download: ({ content }) => {
        const infoHash = content.toString();

        log.info(`Asked to download ${infoHash}`);
        downloadTorrent(content.toString());
      },
      publish: async ({ content }) => {
        const torrent = await createTorrent(content);
        log.info(`Seeding ${torrent.infoHash}`);
      }
    },
    federation.hostname
  );

  log.info('Seeding existing torrents');
  resume();
})();
