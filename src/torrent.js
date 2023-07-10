import { federation } from './modules/config.js';
import { createTorrent, downloadTorrent } from './modules/bt.js';
import { getLogger } from './modules/logging.js';
import {
  bindHandlers,
  createLocalConnection,
  dispatch
} from './modules/rabbitmq.js';

const log = getLogger('torrenter');

(async () => {
  const conn = await createLocalConnection();

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
        dispatch(conn, `${federation.hostname}:infoHash`, torrent.infoHash);
      }
    },
    federation.hostname
  );
})();
