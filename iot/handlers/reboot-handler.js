'use strict';

const { exec } = require('child_process');

class RebootHandler {
  constructor({
    jobsService,
    logger
  }) {
    this.jobsService = jobsService;
    this.logger = logger;
  }

  get Operation() {
    return this.operation;
  }

  reboot(job) {
    exec('sudo /sbin/shutdown -k', (error) => {
      if (error) {
        this.jobsService.reportFailure(job, error);
      } else {
        // Hacky way of reporting success. Wait 1 second before actually rebooting...
        this.jobsService.reportSuccess(job);
        exec('sudo /sbin/shutdown -r 1000');
      }
    });
  }

  executeJobStep(job, status, step) {
    if (status === 'QUEUED') {
      this.logger.info('Rebooting system');
      this.jobsService.reportProgress(job);
      this.reboot();
    } else {
      this.logger.warn({ step }, 'Unexpected job state, failing...');
      this.jobsService.reportFailure(job, 'job in unexpected state');
    }
  }

  handle(error, job) {
    this.logger.debug({ job }, 'Received new job event');

    if (error) {
      this.logger.error({ error }, 'Error in IoT job');
      this.jobsService.reportFailure(job, 'job in unexpected state');
    }

    const { status: { status, statusDetails: { step } = {} } } = job;
    return this.executeJobStep(job, status, step);
  }
}

module.exports = {
  RebootHandler
};
