import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@core/abstracts';
import { User } from '@api/users';
import { CRCFacilityType} from '../report.enums';
import { Exclude } from 'class-transformer';

@Entity()
export class Dispute extends BaseEntity<Dispute> {

    @Exclude()
    @Column()
    userId: number;

    @ManyToOne(_ => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    reportId: string;

    @Column({ type:'enum', enum: CRCFacilityType })
    facilityType: CRCFacilityType;

    @Column({nullable: true})
    facilityId: string;

    @Column({ length: 300 })
    message: string;

}
