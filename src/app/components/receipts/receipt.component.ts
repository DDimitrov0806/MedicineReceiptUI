import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Receipt } from 'src/app/models/receipt.model';
import { ReceiptService } from 'src/app/services/receipt.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap"
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  createModel = {} as Receipt;
  editModel = {} as Receipt;

  receipts = [] as Receipt[];

  dtOptions: DataTables.Settings = {
    scrollX: true,
    pageLength: 50,
    destroy: true
  }

   dtTrigger: Subject<any> = new Subject();

  constructor (
    private receiptService: ReceiptService,
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
          this.receiptService.create(this.createModel).then(() => {
            this.reloadData().then(()=> {
              this.rerender()
            });
          })

          this.toastService.success("Receipt created successfully");          
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
          this.receiptService.delete(id).then(() => {
            this.reloadData().then(()=> {
              this.rerender()
            });
          })

          this.toastService.success("Receipt deleted successfully");          
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => {})
  }

  openEditModal(content: any, id: number) {
    this.clearModels();
    this.editModel = this.receipts.find(p=>p.id === id)!;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then(() => {
        if(!this.isEditModelValid) {
          return;
        }

        try{
          this.receiptService.update(id,this.editModel).then(() => {
            this.reloadData().then(()=> {
              this.rerender()
            });
          })

          this.toastService.success("Receipt edited successfully");          
        }
        catch {
          this.toastService.error("Something went wrong");
        }
      }, () => {})
  }

  private async reloadData() {
    this.receipts = await this.receiptService.getAll();
  }

  private clearModels() {
    this.createModel = {
      id: 0,
      name: "",
      description: "",
      price: 0
    } as Receipt;

    this.editModel = {
      name: "",
      description: "",
      price: 0.0
    } as Receipt
  }
  
  get isCreateModelValid() {
    return this.createModel.name && this.createModel.price;
  }

  get isEditModelValid() {
    return this.editModel.name && this.editModel.price;
  }
}
