import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

import { SellerService } from '../../services/seller.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Seller } from '../../models/seller.model';

@Component({
  selector: 'app-saller',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    CommonModule,
    TagModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    SkeletonModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  providers: [MessageService],
  templateUrl: './saller.component.html',
  styleUrl: './saller.component.css',
})
export class SallerComponent {
  sellers: Seller[] = [];
  sellerForm: FormGroup;
  submitted = false;
  loading = false;
  currentEditingRow: number | null = null;
  displayDeleteDialog: boolean = false;
  sellerToDelete!: Seller | null;
  displayAddSellerDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerService,
    private messageService: MessageService
  ) {
    this.sellerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.fetchSallers();
  }

  fetchSallers() {
    this.sellerService
      .getSellers()
      .subscribe((data) => {
        this.sellers = data;
      })
      .add(() => {
        this.loading = false;
      });
  }

  get f() {
    return this.sellerForm.controls;
  }

  onRowEditInit(user: Seller, index: number) {
    if (this.currentEditingRow !== null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Já existe uma linha em edição.',
      });
      return;
    }
    this.currentEditingRow = index;
    this.sellerForm.patchValue(user);
  }

  onRowEditSave(user: Seller) {
    this.submitted = true;
    if (this.sellerForm.valid) {
      this.loading = true;
      const updatedUser = this.sellerForm.value;

      this.sellerService
        .updateSeller(user.id, updatedUser)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Vendedor atualizado com sucesso',
            });
            this.loading = false;
            this.currentEditingRow = null;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Falha ao atualizar o vendedor',
            });
          },
        })
        .add(() => {
          this.loading = false;
        });
    }
  }

  onRowEditCancel() {
    this.currentEditingRow = null;
  }

  confirmDeleteUser(user: Seller) {
    this.sellerToDelete = user;
    this.displayDeleteDialog = true;
  }

  deleteUser() {
    if (this.sellerToDelete) {
      this.sellerService
        .deleteSeller(this.sellerToDelete.id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário excluído com sucesso.',
            });
            this.fetchSallers();
          },
          error: (error) => {
            console.error('Erro ao excluir usuário:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao excluir usuário.',
            });
          },
        })
        .add(() => {
          this.hideDeleteDialog();
        });
    }
  }

  hideDeleteDialog() {
    this.displayDeleteDialog = false;
    this.sellerToDelete = null;
  }

  showAddSellerDialog() {
    this.displayAddSellerDialog = true;
    this.sellerForm.reset();
  }

  hideAddSellerDialog() {
    this.displayAddSellerDialog = false;
    this.submitted = false;
    this.sellerForm.reset();
  }

  onAddSeller() {
    this.submitted = true;

    if (this.sellerForm.invalid) {
      return;
    }

    const newSeller = this.sellerForm.value;

    this.sellerService
      .register(newSeller)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Vendedor cadastrado com sucesso',
          });
          this.loading = false;
          this.fetchSallers();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Falha ao atualizar o vendedor',
          });
        },
      })
      .add(() => {
        this.loading = false;
        this.hideAddSellerDialog();
      });
  }
}
