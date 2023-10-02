import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, RelationOptions} from 'typeorm';
import { AuthToken } from '../auth/auth.entity';
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
}
