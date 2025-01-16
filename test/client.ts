import { Client } from '..';

const client = new Client({
  localPort: 11223
});
client.ping({port: 22222, host: '35.195.250.243'})
  .then((res) => res.result)
  .catch((reason) => reason)
