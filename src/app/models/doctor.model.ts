import { User } from "./user.model";

export interface Doctor {
    id:number;
    // firstName:string;
    // lastName:string;
    // address:string;
    specialty:string;
    user: User;
}