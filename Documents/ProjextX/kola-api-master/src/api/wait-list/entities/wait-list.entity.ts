import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '@core/abstracts';

@Entity()
export class WaitList extends BaseEntity<WaitList> {

    @Column({ unique: true })
    email: string;

}
