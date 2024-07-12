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

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
@Component({
  selector: 'app-category',
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
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  categories: Category[] = [];
  displayAddCategoryDialog: boolean = false;
  displayDeleteDialog: boolean = false;
  submitted: boolean = false;
  categoryToDelete: any = null;
  loading: boolean = false;
  categoryForm: FormGroup;
  currentEditingRow: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoryService
      .getCategories()
      .subscribe((data) => {
        this.categories = data;
      })
      .add(() => {
        this.loading = false;
      });
  }

  get f() {
    return this.categoryForm.controls;
  }

  showAddCategoryDialog() {
    this.displayAddCategoryDialog = true;
    this.categoryForm.reset();
  }

  hideAddCategoryDialog() {
    this.displayAddCategoryDialog = false;
    this.submitted = false;
    this.categoryForm.reset();
  }

  onAddCategory() {
    this.submitted = true;
    if (this.categoryForm.valid) {
      const newCategory = this.categoryForm.value;

      this.categoryService
        .register(newCategory)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Categoria cadastrada com sucesso',
            });
            this.loading = false;
            this.fetchCategories();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Falha ao atualizar a categoria',
            });
          },
        })
        .add(() => {
          this.loading = false;
          this.hideAddCategoryDialog();
        });
    }
  }

  confirmDeleteCategory(category: Category) {
    this.categoryToDelete = category;
    this.displayDeleteDialog = true;
  }

  deleteCategory() {
    if (this.categoryToDelete) {
      this.categoryService
        .deleteCategory(this.categoryToDelete.id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Categoria excluída com sucesso.',
            });
            this.fetchCategories();
          },
          error: (error) => {
            console.error('Erro ao excluir categoria:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao excluir categoria.',
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
    this.categoryToDelete = null;
  }

  onRowEditInit(category: Category, rowIndex: number) {
    if (this.currentEditingRow !== null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Já existe uma linha em edição.',
      });
      return;
    }
    this.currentEditingRow = rowIndex;
    this.categoryForm.patchValue(category);
  }

  onRowEditSave(category: Category) {
    this.submitted = true;
    if (this.categoryForm.valid) {
      this.loading = true;
      const updatedCategory = this.categoryForm.value;

      this.categoryService
        .updateCategory(category.id, updatedCategory)
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
}
