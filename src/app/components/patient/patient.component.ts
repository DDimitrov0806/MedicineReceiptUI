import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Patient } from 'src/app/models/patient.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent {
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  patients = [] as Patient[];

  hasDoctor:boolean=false;

  dtOptions: DataTables.Settings = {
    scrollX: true,
    pageLength: 50,
    destroy: true
  }

   dtTrigger: Subject<any> = new Subject();

  constructor (
    private patientService: PatientService
  ) { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {   
    this.reloadData().then(()=> {
      this.rerender()
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }
  async reloadData(){
    this.patients = await this.patientService.getAll();
  }
}
