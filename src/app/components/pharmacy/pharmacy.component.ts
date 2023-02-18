import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { param } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Pharmacy } from 'src/app/models/pharmacy.model';
import { PharmacyMedicine } from 'src/app/models/pharmacyMedicine.model';
import { PharmacyMedicineService } from 'src/app/services/pharmacy-medicine.service';
import { PharmacyService } from 'src/app/services/pharmacy.service';
import { ModuleRegistry } from '@ag-grid-community/core';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { MedicineService } from 'src/app/services/medicine.service';
import { Medicine } from 'src/app/models/medicine.model';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  columnDefs!: ColDef[];
  createModel = {} as Pharmacy;
  editModel = {} as PharmacyMedicine;
  medicines = [] as Medicine[];

  selectedMedicineId!: number;

  rowData = [] as PharmacyMedicine[];
  pharmacies = [] as Pharmacy[];

  dtOptions: DataTables.Settings = {
    scrollX: true,
    pageLength: 50,
    destroy: true
  }

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    resizable: true,
  };

  public autoGroupColumnDef: ColDef = {
    field: 'pharmacy_name',
    headerName: 'Pharmacy',
    minWidth: 200,
    valueFormatter: params => params.value ?? ''
  };

  constructor(
    private pharmacyService: PharmacyService,
    private modalService: NgbModal,
    private toastService: ToastrService,
    private pharmacyMedicineService: PharmacyMedicineService,
    private medicineService: MedicineService
  ) { }
  async ngOnInit(): Promise<void> {
    await this.reloadData();

    this.rowData = await this.pharmacyMedicineService.getAll();
    
    this.columnDefs = [
      { field: 'pharmacy_name', headerName: "Pharmacy", rowGroup: true, hide: true},
      { field: 'pharmacy_address', headerName: 'Address' },
      { field: 'medicine_name', headerName: 'Medicine' },
      { field: 'medicine_price', headerName: 'Price' },
      { field: 'pharmacy_id', headerName: 'Edit', cellRenderer: (params: { value: any; }) => '<span><a href="javascript:void(0)>Edit</a></span>'}
    ]
  }

  async onGridReady(params: any) {
    this.rowData = await this.pharmacyMedicineService.getAll();
  }

  openEditModal(content:any, id:any){
    this.clearModels();

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {

        try {
          this.editModel.pharmacy_id=id;

          this.pharmacyMedicineService.create(this.editModel).then(() => {
            this.reloadData().then(() => { });
          })

          this.toastService.success("Medicine added successfully");
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => { })
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
            this.reloadData().then(() => { });
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
            this.reloadData().then(() => { });
          })

          this.toastService.success("Pharmacy deleted successfully");
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => { })
  }

  private async reloadData() {
    this.pharmacies = await this.pharmacyService.getAll();
    this.medicines = await this.medicineService.getAll();
  }

  private clearModels() {
    this.createModel = {
      id: 0,
      name: "",
      address: ""
    } as Pharmacy;
  }

  get isCreateModelValid() {
    return this.createModel.name && this.createModel.address;
  }

  onCellClicked(event:any, errorModal: any) {
    if (event.colDef?.field as string === 'pharmacy_id' && Number(event.value) > 0) {
      const id = event.data.pharmacy_id;

      this.modalService.open(errorModal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
        .result.then(() => { 
          this.editModel.pharmacy_id=id;

          this.pharmacyMedicineService.create(this.editModel).then(() => {
            this.reloadData().then(() => { });
          })
        }).catch(() => { });
    
    }
  }
}
