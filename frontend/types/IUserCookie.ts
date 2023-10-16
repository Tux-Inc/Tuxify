import { User } from "~/types/IUser";

export interface IUserCookie {
    user: User;
    accessToken: string;
    refreshToken: string;
}