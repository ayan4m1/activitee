import amqplib from 'amqplib';

import { getLogger } from './logging.js';

const log = getLogger('rabbit');

export async function createConnection(url) {
  try {
    return await amqplib.connect(url);
  } catch (error) {
    log.error(error);
  }

  return null;
}

export async function bindHandlers(connection, handlers) {
  const channelPromises = [];
  const handlerEntries = Object.entries(handlers);

  for (let i = 0; i < handlerEntries.length; i++) {
    channelPromises.push(connection.createChannel());
  }

  const channels = await Promise.all(channelPromises);

  await Promise.all(
    channels.map((channel, i) => channel.assertQueue(handlerEntries[i][0]))
  );

  for (let i = 0; i < handlerEntries.length; i++) {
    channels[i].consume(...handlerEntries[i]);
  }
}
