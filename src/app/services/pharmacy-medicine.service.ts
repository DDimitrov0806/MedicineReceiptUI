import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PharmacyMedicine } from '../models/pharmacyMedicine.model';
import { lastValueFrom } from 'rxjs';

const baseUrl = 'http://localhost:8000/api/pharmacy-medicine';

@Injectable({
  providedIn: 'root'
})
export class PharmacyMedicineService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<PharmacyMedicine[]> {
    return await lastValueFrom(this.http.get<PharmacyMedicine[]>(baseUrl));
  }

  async create(data: PharmacyMedicine) {
    return await lastValueFrom(this.http.post(baseUrl, data,{responseType: "text"}));
  }
}
