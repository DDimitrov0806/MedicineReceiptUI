import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Medicine } from 'src/app/models/medicine.model';
import { MedicineService } from 'src/app/services/medicine.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  createModel = {} as Medicine;
  editModel = {} as Medicine;

  medicines = [] as Medicine[];

  dtOptions: DataTables.Settings = {
    scrollX: true,
    pageLength: 50,
    destroy: true
  }

   dtTrigger: Subject<any> = new Subject();

  constructor (
    private medicineService: MedicineService,
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
          this.medicineService.create(this.createModel).then(() => {
            this.reloadData().then(()=> {
              this.rerender()
            });
          })

          this.toastService.success("Medicine created successfully");          
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
          this.medicineService.delete(id).then(() => {
            this.reloadData().then(()=> {
              this.rerender()
            });
          })

          this.toastService.success("Medicine deleted successfully");          
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => {})
  }

  openEditModal(content: any, id: number) {
    this.clearModels();
    this.editModel = this.medicines.find(p=>p.id === id)!;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then(() => {
        if(!this.isEditModelValid) {
          return;
        }

        try{
          this.medicineService.update(id,this.editModel).then(() => {
            this.reloadData().then(()=> {
              this.rerender()
            });
          })

          this.toastService.success("Medicine edited successfully");          
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => {})
  }

  private async reloadData() {
    this.medicines = await this.medicineService.getAll();
  }

  private clearModels() {
    this.createModel = {
      id: 0,
      name: "",
      description: "",
      price: 0
    } as Medicine;

    this.editModel = {
      name: "",
      description: ""
    } as Medicine
  }
  
  get isCreateModelValid() {
    return this.createModel.name;
  }

  get isEditModelValid() {
    return this.editModel.name;
  }
}
