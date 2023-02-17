import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorComponent } from './components/doctor/doctor.component';
import { LoginComponent } from './components/login/login.component';
import { MedicineComponent } from './components/medicine/medicine.component';
import { PatientComponent } from './components/patient/patient.component';
import { PharmacyComponent } from './components/pharmacy/pharmacy.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'medicine', component: MedicineComponent },
  { path: 'pharmacy', component: PharmacyComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'patient', component: PatientComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
