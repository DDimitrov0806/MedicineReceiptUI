import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Medicine } from '../models/medicine.model';

const baseUrl = 'http://127.0.0.1:8000/api/medicines/';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Medicine[]> {
    return await lastValueFrom(this.http.get<Medicine[]>(baseUrl));
  }

  async get(id: number): Promise<Medicine> {
    return await lastValueFrom(this.http.get<Medicine>(`${baseUrl}${id}/`));
  }

  async create(data: Medicine) {
    return await lastValueFrom(this.http.post(baseUrl, data,{responseType: "text"}));
  }

  async update(id: number, data: Medicine) {
    return await lastValueFrom(this.http.put(`${baseUrl}${id}/`, data,{responseType: "text"}));
  }

  async delete(id: number) {
    return await lastValueFrom(this.http.delete(`${baseUrl}${id}/`,{responseType: "text"}));
  }
}
