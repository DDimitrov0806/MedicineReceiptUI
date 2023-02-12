import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicineComponent } from './components/medicine/medicine.component';

const routes: Routes = [
  { path: '', redirectTo: 'medicine', pathMatch: 'full'},
  { path: 'medicine', component: MedicineComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
