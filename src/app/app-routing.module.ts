import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptComponent } from './components/receipts/receipt.component';

const routes: Routes = [
  { path: '', redirectTo: 'receipt', pathMatch: 'full'},
  { path: 'receipt', component: ReceiptComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
