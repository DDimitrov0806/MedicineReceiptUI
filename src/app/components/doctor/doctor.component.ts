import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';
import { Patient } from 'src/app/models/patient.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit,AfterViewInit,OnDestroy{
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  doctors = [] as Doctor[];

  dtOptions: DataTables.Settings = {
    scrollX: true,
    pageLength: 50,
    destroy: true
  }

  dtTrigger: Subject<any> = new Subject();

  constructor (
    private patientService: PatientService,
    private doctorService: DoctorService
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
    this.doctors = await this.doctorService.getAll();
  }

  async selectDoctor(id:number) {
    await this.patientService.selectDoctor(id);
    await this.reloadData();
  }
}
