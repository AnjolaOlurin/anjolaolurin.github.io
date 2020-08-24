import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@core/abstracts';
import { User } from '@api/users';
import { ReportStatus } from '../report.enums';

@Entity()
export class ReportOverview extends BaseEntity<ReportOverview> {
    @Column()
    userId: number;

    @OneToOne(_ => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({nullable: true})
    reportId: number;

    @Column({ type: 'varchar', array:  true, nullable: true })
    phoneChallenge: string[];

    @Column({ default: false})
    phoneChallengePassed: boolean;

    // Status of the report
    @Column({ type:'enum', enum: ReportStatus, default: ReportStatus.Pending })
    status: ReportStatus;

}
