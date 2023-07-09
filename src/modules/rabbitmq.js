import amqplib from 'amqplib';

import { getLogger } from './logging.js';

const log = getLogger('rabbit');

export async function createConnection(url) {
  try {
    return await amqplib.connect(url);
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
  }

  return null;
}

export async function bindHandlers(connection, handlers, hostname = '') {
  try {
    const channelPromises = [];
    const handlerEntries = Object.entries(handlers);

    for (let i = 0; i < handlerEntries.length; i++) {
      channelPromises.push(connection.createChannel());
    }

    const channels = await Promise.all(channelPromises);

    await Promise.all(
      channels.map((channel, i) =>
        channel.assertQueue(
          hostname
            ? `${hostname}:${handlerEntries[i][0]}`
            : handlerEntries[i][0]
        )
      )
    );

    for (let i = 0; i < handlerEntries.length; i++) {
      channels[i].consume(
        hostname ? `${hostname}:${handlerEntries[i][0]}` : handlerEntries[i][0],
        handlerEntries[i][1]
      );
    }
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
  }
}

export async function dispatch(connection, queue, data) {
  try {
    const channel = await connection.createChannel();

    channel.sendToQueue(
      queue,
      Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf-8')
    );
  } catch (error) {
    log.error(error.message);
    log.error(error.stack);
  }
}
