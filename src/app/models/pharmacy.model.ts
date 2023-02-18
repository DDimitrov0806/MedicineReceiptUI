import { Medicine } from "./medicine.model";
import { PharmacyMedicine } from "./pharmacyMedicine.model";

export interface Pharmacy {
    id:number;
    name:string;
    address:string;
    medicine:Medicine;
    pharmacyMedicine: PharmacyMedicine;
}