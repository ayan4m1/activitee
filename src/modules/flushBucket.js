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

    this.taskHandle = setInterval(this.flush, this.flushIntervalSec * 1000);
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
