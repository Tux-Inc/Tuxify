import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    OneToOne,
    RelationOptions,
    JoinColumn
} from 'typeorm';
import { AuthToken } from '../auth/auth.entity';
import {ResetPassword} from "../resetPassword/resetPassword.entity";
import {EmailVerification} from "../emailVerification/emailVerification.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {unique: true})
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ default: 'false' })
    isVerified: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @OneToOne(type => AuthToken)
    @JoinColumn()
    authToken: AuthToken;

    @OneToOne(type => ResetPassword)
    @JoinColumn()
    resetPassword: ResetPassword;

    @OneToOne(type => EmailVerification)
    @JoinColumn()
    emailVerification: EmailVerification;
}