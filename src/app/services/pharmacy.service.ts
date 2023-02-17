import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Pharmacy } from '../models/pharmacy.model';


const baseUrl = 'http://localhost:8000/api/pharmacy';


@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  constructor(private http: HttpClient) { }

  async getAll(): Promise<Pharmacy[]> {
    return await lastValueFrom(this.http.get<Pharmacy[]>(baseUrl));
  }

  async get(id: number): Promise<Pharmacy> {
    return await lastValueFrom(this.http.get<Pharmacy>(`${baseUrl}/${id}`));
  }

  async create(data: Pharmacy) {
    return await lastValueFrom(this.http.post(baseUrl, data,{responseType: "text"}));
  }

  async update(id: number, data: Pharmacy) {
    return await lastValueFrom(this.http.put(`${baseUrl}/${id}`, data,{responseType: "text"}));
  }

  async delete(id: number) {
    return await lastValueFrom(this.http.delete(`${baseUrl}/${id}`,{responseType: "text"}));
  }
}
