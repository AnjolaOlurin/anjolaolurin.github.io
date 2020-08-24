import { ConfigService } from './config.service';
import { Injectable } from '@nestjs/common';
import { JobService } from '@core/services/job.service';
import { EmailJob, IEmailName } from '@core/jobs/email.job';
import { QueueTasks, EmailSenders, SMSSenders } from '@core/helpers';
import { SMSJob } from '@core/jobs/sms.job';


/**
 * Builds email job
 * and adds to @{WorkerQueues.PROCESS_EMAIL} queue for processing
 *
 */
@Injectable()
export class MailHandler {

    constructor(
        private readonly config: ConfigService,
        private readonly jobService: JobService) { }

    handleEmail(emailName: IEmailName, subject: string, template: string, additionalContent: object = {}) {

        const defaultContent = {
            static_domain: this.config.STATIC_CDN_DOMAIN,
            site_domain: this.config.SITE_DOMAIN,
        };

        const emailJob = new EmailJob()
            .setFrom(EmailSenders.NO_REPLY)
            .setTo(emailName)
            .setSubject(subject)
            .setTemplate(template)
            .setContent(Object.assign(defaultContent, additionalContent));

        this.jobService.addJobToQueue(emailJob, QueueTasks.SEND_EMAIL);

    }


    handleSMS(phone: string, template: string, content: object) {

        const job = new SMSJob()
            .setFrom(SMSSenders.KOLA_CREDIT)
            .setTo(phone)
            .setTemplate(template)
            .setContent(content);

        this.jobService.addJobToQueue(job, QueueTasks.SEND_SMS);

    }
}
