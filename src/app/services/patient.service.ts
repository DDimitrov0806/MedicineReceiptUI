import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

const baseUrl = 'http://localhost:8000/api/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Patient[]> {
    return await lastValueFrom(this.http.get<Patient[]>(baseUrl));
  }
  
  async selectDoctor(doctor_id?:number) {
    return await lastValueFrom(this.http.put(`${baseUrl}/${doctor_id}`, {responseType: "text"}))
  }

  async getPatientsForDoctor(){
    return await lastValueFrom(this.http.get<Patient[]>(`${baseUrl}/get-patients-for-user`))
  }
}
