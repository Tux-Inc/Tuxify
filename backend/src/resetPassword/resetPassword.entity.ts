import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";


@Entity()

export class ResetPassword {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    email: string;

    @Column()
    createdAt: Date;

    @OneToOne(type => User, user => user.resetPassword)
    user: User;
}