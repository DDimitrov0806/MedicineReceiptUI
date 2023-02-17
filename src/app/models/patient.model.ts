import { User } from "./user.model";

export interface Patient {
    id:number;
    pin:string;
    user: User;
}