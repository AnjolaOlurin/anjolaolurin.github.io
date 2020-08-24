import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@core/abstracts';
import { User } from '@api/users';
import { CRCClassicPreminumSummary } from '../crc.interface';
import { Exclude } from 'class-transformer';

@Entity()
export class ClassicReport extends BaseEntity<ClassicReport> {

    @Column()
    @Exclude()
    userId: number;

    @ManyToOne(_ => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    // Credit Score
    @Column()
    creditScore: number;

    // Credit Score
    @Column()
    creditRating: string;

    @Column({ type:'varchar', array:  true })
    creditRatingReasons: string[];

    @Column({ type: 'float', nullable: true })
    totalAmountOverdue: number;

    @Column({ type:'jsonb', nullable: true })
    commercial: CRCClassicPreminumSummary;

    @Column({ type:'jsonb', nullable: true })
    microfinance: CRCClassicPreminumSummary;

    @Column({ type:'jsonb', nullable: true })
    mortgage: CRCClassicPreminumSummary;

}
