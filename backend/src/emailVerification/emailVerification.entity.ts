import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";


@Entity()

export class EmailVerification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    email: string;

    @Column()
    createdAt: Date;

    @OneToOne(type => User, user => user.emailVerification)
    user: User;
}