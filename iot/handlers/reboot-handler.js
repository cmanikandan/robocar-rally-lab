'use strict';

function handle(err, job) {
  console.log(`Received new job event JSON.stringify(job)`);

  if (job.status.status === 'QUEUED' ||
    isUndefined(job.status.statusDetails) ||
    isUndefined(job.status.statusDetails.step)) {
 
    job.inProgress({ operation: job.operation, step: 'initiated' }, function(err) {
      showJobsError(err);
 
      const delay = (isUndefined(job.document.delay) ? '0' : job.document.delay.toString());
 
      exec('sudo /sbin/shutdown -r +' + delay, function (err) { 
        if (!isUndefined(err)) {
          job.failed({ operation: job.operation, errorCode: 'ERR_SYSTEM_CALL_FAILED', errorMessage: 'unable to execute reboot, check passwordless sudo permissions on agent', error: errorToString(err) }, showJobsError);
        }
      });
    });
 
  } else if (job.status.statusDetails.step === 'initiated') {
    job.succeeded({ operation: job.operation, step: 'rebooted' }, showJobsError);
  } else {
    job.failed({ operation: job.operation, errorCode: 'ERR_UNEXPECTED', errorMessage: 'reboot job execution in unexpected state' }, showJobsError);
  }
}

module.exports = {
  handle
}