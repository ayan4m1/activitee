import { globby } from 'globby';
import { writeFile } from 'fs/promises';
// eslint-disable-next-line
import WebTorrent from 'webtorrent';

import { torrent as torrentConfig } from './config.js';
import { getLogger } from './logging.js';

const log = getLogger('bt');
const client = new WebTorrent({
  torrentPort: torrentConfig.port,
  dhtPort: torrentConfig.dhtPort
});

export const resume = async () => {
  const files = await globby('./torrents/*.torrent');
  const torrents = [];

  for (const file of files) {
    log.info(`Seeding ${file}`);
    torrents.push(client.add(file));
  }

  return torrents;
};

export const downloadTorrent = (infoHash) => client.add(infoHash);

export const createTorrent = (data) =>
  new Promise((resolve) => {
    client.seed(
      Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf-8'),
      (torrent) => {
        writeFile(
          `./torrents/${torrent.infoHash}.torrent`,
          torrent.torrentFile,
          {
            encoding: 'utf-8'
          }
        );
        resolve(torrent);
      }
    );
  });
