import amqplib from 'amqplib';

const conn = await amqplib.connect('amqp://localhost');

export async function bindHandlers(onDownload, onSeed) {
  const [downloadChannel, seedChannel] = await Promise.all([
    conn.createChannel(),
    conn.createChannel()
  ]);

  await Promise.all([
    downloadChannel.assertQueue('download'),
    seedChannel.assertQueue('seed')
  ]);

  downloadChannel.consume('download', onDownload);
  seedChannel.consume('seed', onSeed);
}
