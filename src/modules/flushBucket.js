export class FlushBucket {
  items;
  running;
  flusher;
  taskHandle;
  maxBucketSize = 100;
  flushIntervalSec = 60;

  constructor(flusher) {
    this.items = [];
    this.flusher = flusher;
    this.pushItem = this.pushItem.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.flush = this.flush.bind(this);
  }

  pushItem(item) {
    this.items.push(item);
    if (this.items.length === this.maxBucketSize) {
      this.flush();
    }
  }

  start() {
    if (this.running) {
      return;
    }

    this.taskHandle = setInterval(
      this.flush,
      this.flushIntervalSec * 60 * 1000
    );
    this.running = true;
  }

  stop() {
    if (!this.running || !this.taskHandle) {
      return;
    }

    clearInterval(this.taskHandle);
    this.running = false;
  }

  flush() {
    this.flusher(this.items);
    this.items = [];
  }
}
