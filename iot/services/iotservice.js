'use strict';

module.exports = (client, host, port, thing, thingType, logger) => {
  client.on('connect', () => {
    logger.info({ host, port, thing }, 'Connected to IoT service');

    const topic = `${thingType}/hello`;
    client.publish(topic, JSON.stringify({ Name: thing }));
    logger.debug({ thing, topic }, 'Published message');
  });

  client.on('close', () => {
    logger.info({ thing }, 'Connection closed');
  });

  client.on('reconnect', () => {
    logger.debug({ thing }, 'Reconnecting to IoT service');
  });

  client.on('offline', () => {
    logger.debug({ thing }, 'Offline');
  });

  client.on('error', (error) => {
    logger.error({ error, thing }, 'Connection error');
  });

  client.on('message', (topic, payload) => {
    logger.debug({ topic, payload }, 'Received new message');
  });

  function publish(topic, object) {
    client.publish(topic, JSON.stringify(object));
  }

  return {
    publish
  };
};
