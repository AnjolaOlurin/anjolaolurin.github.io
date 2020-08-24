import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@core/abstracts';
import { User } from '@api/users';
import { CRCBasicCreditSummary } from '../crc.interface';

@Entity()
export class BasicReport extends BaseEntity<BasicReport> {

    @Column()
    userId: number;

    @ManyToOne(_ => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type:'jsonb', nullable: true })
    commercialSummary: CRCBasicCreditSummary;

    @Column({ type:'jsonb', nullable: true })
    microfinanceSummary: CRCBasicCreditSummary;

    @Column({ type:'jsonb', nullable: true })
    mortgageSummary: CRCBasicCreditSummary;

    // The computed credit score for  Basic Report
    @Column({ nullable: true})
    creditRating: string;

}
