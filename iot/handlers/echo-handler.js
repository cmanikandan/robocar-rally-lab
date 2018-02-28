'use strict';

// TODO: Remove me
const STEP_STARTED = 'started';
const STEP_FINISHED = 'finished';

// TODO: Remove me
function reportProgress(operation, job, step) {
  job.inProgress({
    operation,
    step
  });
}

// TODO: Remove me
function reportSuccess(operation, job) {
  job.succeeded({
    operation,
    step: STEP_FINISHED
  });
}

// TODO: Remove me
function reportFailure(operation, job, errorCode, error) {
  job.failed({
    operation,
    errorCode,
    error
  });
}

class EchoHandler {
  constructor({
    thingName,
    thingTypeName,
    iotService,
    logger
  }) {
    this.operation = 'echo';
    this.thing = thingName;
    this.topic = `${thingTypeName}/echo`;
    this.iotService = iotService;
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

  handleStep(job, status, step, message) {
    if (status === 'QUEUED' || !step) {
      this.logger.info('Handling echo job');
      reportProgress(this.operation, job, STEP_STARTED);
      this.echo(message);
      reportSuccess(this.operation, job);
    } else {
      this.logger.warn({ step }, 'Unexpected job state, failing...');
      reportFailure(this.operation, job, 'ERR_UNEXPECTED', 'job in unexpected state');
    }
  }

  handle(error, job) {
    this.logger.debug({ job }, 'Received new job event');

    if (error) {
      this.logger.error({ error }, 'Error in IoT job');
      return reportFailure(this.operation, job, 'ERR_UNEXPECTED', 'job in unexpected state');
    }

    const { document: { message } = {}, status: { status, statusDetails: { step } = {} } } = job;
    return this.handleStep(job, status, step, message);
  }
}

module.exports = {
  EchoHandler
};
