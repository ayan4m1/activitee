import jsonfile from 'jsonfile';

import { FlushBucket } from './modules/flushBucket.js';
import { resume } from './modules/bt.js';
import { getLogger } from './modules/logging.js';

const { writeFile } = jsonfile;
const log = getLogger('app');

(async () => {
  log.info('Starting up');
  resume();
  const bucket = new FlushBucket((items) =>
    writeFile(`./${Date.now()}.json`, items)
  );

  bucket.start();
  setInterval(
    () => bucket.pushItem({ value: Math.random() }),
    Math.ceil(Math.random() * 100)
  );
  // await createTorrent(JSON.stringify('test'));
})();
