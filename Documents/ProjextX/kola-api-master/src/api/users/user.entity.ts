import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { BaseEntity } from '@core/abstracts';
import { AccountStatus } from '@core/helpers';
import { Exclude } from 'class-transformer';


export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
}

export interface PaystackBvnData {
    first_name: string,
    last_name: string,
    dob: string,
    formatted_dob: string,
    mobile: string,
    bvn: string
}

@Entity()
export class User extends BaseEntity<User> {

    // How many times we rerun hasher to make password cracking slower
    static SALT_ROUNDS = 10;

    // User's firstName, settable by the user
    @Column({ length: 50, nullable: true })
    firstName: string;

    // User's lastName, settable by the user
    @Column({ length: 50, nullable: true })
    lastName: string;

    // User's gender
    @Column('enum', { enum: UserGender, nullable: true })
    gender: UserGender;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    // User's phone number, settable by the user
    @Column({ length: 50, unique: true })
    phone: string;

    @Column({ default: false })
    phoneConfirmed: boolean;

    // User's referalCode, settable by the user
    @Column({ length: 50, nullable: true })
    referalCode: string;

    // Set after the email verification completes
    @Column({ length: 50, unique: true })
    email: string;

    @Column({ default: false })
    emailConfirmed: boolean;

    // Set bvn verification completes
    @Column({ length: 11, unique: true, nullable: true })
    bvn: string;

    // Set bvn verification completes
    @Exclude()
    @Column({ type:'jsonb', nullable: true })
    bvnRawData: PaystackBvnData;

    // Set bvn verification completes
    @Column({ default: false })
    bvnConfirmed: boolean;

    // Set after the email verification completes
    @Column({ length: 16, nullable: true, unique: true })
    @Exclude()
    securityToken: string;

    // When the user registerd / requested email change
    @Column({ type: 'timestamptz', nullable: true })
    @Exclude()
    securityTokenRequestedAt: Date;

    // Set when user resets password, when user is forcefully banned, etc.
    // If securityOperationPerformedAt > session created at, terminate the user session
    @Column({ type: 'timestamptz', default: () => 'LOCALTIMESTAMP' })
    @Exclude()
    securityOperationPerformedAt: Date;

    // A hashed password
    @Column()
    @Exclude()
    passwordHash: string;

    // Account status of the user - this gives more context to status of a user
    @Column('enum', { enum: AccountStatus, default: AccountStatus.PENDING })
    status: AccountStatus;

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

}
