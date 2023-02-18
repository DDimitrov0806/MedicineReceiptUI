import { Medicine } from "./medicine.model";
import { Pharmacy } from "./pharmacy.model";

export interface PharmacyMedicine {
    pharmacy_id: number;
    pharmacy_name: string;
    pharmacy_address: string;
    medicine_id: number;
    medicine_name:string;
    medicine_description?:string;
    medicine_price:number;
}