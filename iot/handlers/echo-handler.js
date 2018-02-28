'use strict';

class EchoHandler {
  constructor({
    thingName,
    thingTypeName,
    iotService,
    jobsService,
    logger
  }) {
    this.operation = 'echo';
    this.thing = thingName;
    this.topic = `${thingTypeName}/echo`;
    this.iotService = iotService;
    this.jobsService = jobsService;
    this.logger = logger;
  }

  get Operation() {
    return this.operation;
  }

  echo(message) {
    const payload = {
      thing: this.thing,
      message
    };
    this.iotService.publish(this.topic, JSON.stringify(payload));
    this.logger.debug({ topic: this.topic, payload }, 'Published message');
  }

  executeJob(job, status, message) {
    if (status === 'QUEUED') {
      this.logger.info('Handling echo job');
      this.jobsService.reportProgress(job);
      this.echo(message);
      this.jobsService.reportSuccess(job);
    } else {
      this.logger.warn('Unexpected job state, failing...');
      this.jobsService.reportFailure(job, 'job in unexpected state');
    }
  }

  handle(error, job) {
    this.logger.debug({ job }, 'Received new job event');

    if (error) {
      this.logger.error({ error }, 'Error in IoT job');
      this.jobsService.reportFailure(job, 'job in unexpected state');
    }

    const { document: { message } = {}, status: { status } } = job;
    return this.executeJob(job, status, message);
  }
}

module.exports = {
  EchoHandler
};
