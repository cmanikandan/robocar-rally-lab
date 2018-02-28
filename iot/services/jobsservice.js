'use strict';

// TODO: Refactor away jobs to get rid of circular dependency
module.exports = (jobs, thing, logger) => {
  function registerHandler(handler) {
    jobs.subscribeToJobs(thing, handler.Operation, (error, job) => handler.handle(error, job));
  }

  function start() {
    jobs.startJobNotifications(thing);
  }

  function reportProgress(job, step) {
    logger.debug({ job, step }, 'Job in progress');
    job.inProgress({ step });
  }

  function reportSuccess(job) {
    logger.debug({ job }, 'Job finished successfully');
    job.succeeded();
  }

  function reportFailure(job, error) {
    logger.debug({ job, error }, 'Job failed');
    job.failed({ error });
  }

  return {
    registerHandler,
    start,
    reportProgress,
    reportSuccess,
    reportFailure
  };
};
