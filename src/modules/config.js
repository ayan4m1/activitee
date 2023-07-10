import 'dotenv/config';

export const logging = {
  level: process.env.ACT_LOG_LEVEL || 'info',
  timestampFormat: process.env.ACT_LOG_TIME_FMT
};

export const torrent = {
  port: parseInt(process.env.ACT_TORRENT_PORT || '1234', 10),
  dhtPort: parseInt(process.env.ACT_TORRENT_DHT_PORT || '6881', 10)
};

export const rabbit = {
  hostname: process.env.ACT_RABBIT_HOSTNAME,
  username: process.env.ACT_RABBIT_USERNAME,
  password: process.env.ACT_RABBIT_PASSWORD
};

export const federation = {
  hostname: process.env.ACT_FEDERATION_HOSTNAME,
  instances: (process.env.ACT_FEDERATION_INSTANCES || '').split(',')
};
