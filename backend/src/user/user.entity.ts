import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, RelationOptions} from 'typeorm';
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

    @Column()
    resetPasswordToken: string;

    @OneToOne(type => AuthToken, auth => auth.user)
    authToken: string | ((object: User) => any) | RelationOptions;

    @OneToOne(type => ResetPassword, resetPassword => resetPassword.user)
    resetPassword: string | ((object: User) => any) | RelationOptions;

    @OneToOne(type => EmailVerification, emailVerification => emailVerification.user)
    emailVerification: string | ((object: User) => any) | RelationOptions;
}