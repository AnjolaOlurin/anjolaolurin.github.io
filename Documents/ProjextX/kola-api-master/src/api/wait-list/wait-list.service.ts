import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailSubjects, EmailTemplates, DUPLICATE_UNIQUE_CONSTRAINT_CODE, EmailSenders } from '@core/helpers';
import { MailHandler } from '@core/services';
import { EmailConflictException } from '@common/exceptions';
import { WaitList } from './entities';
import { PostWaitListDto } from './dto/post-wait-list.dto';

@Injectable()
export class WaitListService  {

    constructor(
        private readonly mailHandler: MailHandler,
        @InjectRepository(WaitList) public readonly repository: Repository<WaitList>){}

    async addToWaitList(data: PostWaitListDto) {

        try {
            const entity = this.repository.create(data);
            await this.repository.save(entity);

            // Send mail to user & admin mail
            this.handleMails(entity);

        } catch (err) {
            if (err && err.code === DUPLICATE_UNIQUE_CONSTRAINT_CODE) {
                throw new EmailConflictException();
            }
            throw err;
        }

    }

    async getWaitList() {
       return  await this.repository.find({});
    }


    private handleMails(user:  {email: string}){
        // Send mail to user
        this.mailHandler.handleEmail(user, EmailSubjects.WAIT_LIST, EmailTemplates.WAIT_LIST);

        // Send mail to admin
        const additionalContent = {subscriberEmail: user.email};
        this.mailHandler.handleEmail(EmailSenders.HELLO, EmailSubjects.WAIT_LIST, EmailTemplates.ADMIN_WAIT_LIST, additionalContent);

    }
}
