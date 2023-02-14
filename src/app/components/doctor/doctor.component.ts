import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit,AfterViewInit,OnDestroy{
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  createModel = {} as Doctor;
  editModel = {} as Doctor;

  doctors = [] as Doctor[];

  dtOptions: DataTables.Settings = {
    scrollX: true,
    pageLength: 50,
    destroy: true
  }

   dtTrigger: Subject<any> = new Subject();

  constructor (
    private doctorService: DoctorService,
    private modalService: NgbModal,
    private toastService: ToastrService
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
  openCreateModal(content: any) {
    this.clearModels();

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then(() => {
        if(!this.isCreateModelValid){
          return;
        }
        try{
          this.doctorService.create(this.createModel).then(() => {
            this.reloadData().then(()=> {
              this.rerender()
            });
          })

          this.toastService.success("Doctor created successfully");          
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => {})
  }

  openDeleteModal(content: any, id: number) {
    this.clearModels();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then(() => {
        try{
          this.doctorService.delete(id).then(() => {
            this.reloadData().then(()=> {
              this.rerender()
            });
          })

          this.toastService.success("Doctor deleted successfully");          
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => {})
  }

  openEditModal(content: any, id: number) {
    this.clearModels();
    this.editModel = this.doctors.find(p=>p.id === id)!;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then(() => {
        if(!this.isEditModelValid) {
          return;
        }

        try{
          this.doctorService.update(id,this.editModel).then(() => {
            this.reloadData().then(()=> {
              this.rerender()
            });
          })

          this.toastService.success("Doctor edited successfully");          
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => {})
  }

  private async reloadData() {
    this.doctors = await this.doctorService.getAll();
  }

  private clearModels() {
    this.createModel = {
      id: 0,
      name: "",
      address:""
    } as Doctor;

    this.editModel = {
      id:0,
      name: "",
      address:""
    } as Doctor
  }
  
  get isCreateModelValid() {
    return this.createModel.name && this.createModel.address;
  }

  get isEditModelValid() {
    return this.editModel.name && this.editModel.address;
  }
}
