import { resume } from './modules/bt.js';
import { getLogger } from './modules/logging.js';

const log = getLogger('app');

(async () => {
  log.info('Starting up');
  resume();
  // await createTorrent(JSON.stringify('test'));
})();
