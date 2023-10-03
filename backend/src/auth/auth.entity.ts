import {Column, Entity, JoinColumn, JoinTable, OneToOne, PrimaryGeneratedColumn, RelationOptions} from "typeorm";
import {User} from "../user/user.entity";


@Entity()

export class AuthToken {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    expires: Date;

    @Column()
    created: Date;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

}