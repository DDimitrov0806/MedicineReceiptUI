import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Doctor } from '../models/doctor.model';

const baseUrl = 'http://localhost:8000/api/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Doctor[]> {
    return await lastValueFrom(this.http.get<Doctor[]>(baseUrl));
  }

  async get(id: number): Promise<Doctor> {
    return await lastValueFrom(this.http.get<Doctor>(`${baseUrl}/${id}`));
  }

  async create(data: Doctor) {
    return await lastValueFrom(this.http.post(baseUrl, data,{responseType: "text"}));
  }

  async update(id: number, data: Doctor) {
    return await lastValueFrom(this.http.put(`${baseUrl}/${id}`, data,{responseType: "text"}));
  }

  async delete(id: number) {
    return await lastValueFrom(this.http.delete(`${baseUrl}/${id}`,{responseType: "text"}));
  }
}
