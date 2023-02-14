import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Pharmacy } from 'src/app/models/pharmacy.model';
import { PharmacyService } from 'src/app/services/pharmacy.service';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  createModel = {} as Pharmacy;
  editModel = {} as Pharmacy;

  pharmacies = [] as Pharmacy[];

  dtOptions: DataTables.Settings = {
    scrollX: true,
    pageLength: 50,
    destroy: true
  }

  dtTrigger: Subject<any> = new Subject();

  constructor(
    private pharmacyService: PharmacyService,
    private modalService: NgbModal,
    private toastService: ToastrService
  ) { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.reloadData().then(() => {
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

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        if (!this.isCreateModelValid) {
          return;
        }
        try {
          this.pharmacyService.create(this.createModel).then(() => {
            this.reloadData().then(() => {
              this.rerender()
            });
          })

          this.toastService.success("Pharmacy created successfully");
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => { })
  }

  openDeleteModal(content: any, id: number) {
    this.clearModels();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        try {
          this.pharmacyService.delete(id).then(() => {
            this.reloadData().then(() => {
              this.rerender()
            });
          })

          this.toastService.success("Pharmacy deleted successfully");
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => { })
  }

  openEditModal(content: any, id: number) {
    this.clearModels();
    this.editModel = this.pharmacies.find(p => p.id === id)!;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {
        if (!this.isEditModelValid) {
          return;
        }

        try {
          this.pharmacyService.update(id, this.editModel).then(() => {
            this.reloadData().then(() => {
              this.rerender()
            });
          })

          this.toastService.success("Pharmacy edited successfully");
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => { })
  }

  private async reloadData() {
    this.pharmacies = await this.pharmacyService.getAll();
  }

  private clearModels() {
    this.createModel = {
      id: 0,
      name: "",
      address: ""
    } as Pharmacy;

    this.editModel = {
      id: 0,
      name: "",
      address: ""
    } as Pharmacy
  }

  get isCreateModelValid() {
    return this.createModel.name && this.createModel.address;
  }

  get isEditModelValid() {
    return this.editModel.name && this.editModel.address;
  }
}
