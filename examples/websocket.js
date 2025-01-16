const Client = require('../').WsClient;
const client = new Client('ws://<IP>:8080');

client.on('listening', () => {
  client.statistics()
    .then((res) => {
      console.log('received data', res);
      return;
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    });
});
