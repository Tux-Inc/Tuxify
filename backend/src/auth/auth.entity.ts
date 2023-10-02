import {Column, Entity, JoinTable, OneToOne, PrimaryGeneratedColumn, RelationOptions} from "typeorm";
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

    @Column()

    @OneToOne(type => User, user => user.authToken)
    user: string | ((object: AuthToken) => any) | RelationOptions;

}