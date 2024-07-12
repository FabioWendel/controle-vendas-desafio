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
import { FileUploadModule } from 'primeng/fileupload';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-product',
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
    FileUploadModule,
  ],
  providers: [MessageService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {
  products: Product[] = [];
  categories: Category[] = [];
  displayAddProductDialog: boolean = false;
  displayDeleteDialog: boolean = false;
  submitted: boolean = false;
  productToDelete: any = null;
  loading: boolean = false;
  productForm: FormGroup;
  currentEditingRow: number | null = null;
  imageDir = environment.imageDir;
  isEditing: boolean = false;
  selectedProduct: Product | null = null;
  optionCategoryModel!: number;
  productImage!: string;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      stock_quantity: ['', [Validators.required, Validators.min(0)]],
      category_id: ['', Validators.required],
      seller_id: [localStorage.getItem('id') || '', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.fetchProducts();
    this.fetchCategories();
  }

  onFileSelect(event: any) {
    const file: File = event.files[0];
    this.productForm.patchValue({
      image: file,
    });
    this.productImage = '';
  }

  onFileClear() {
    this.productForm.patchValue({ image: null });
  }

  getImage(file: string) {
    return `${this.imageDir}/${file}`;
  }

  fetchProducts() {
    this.productService
      .getProducts()
      .subscribe({
        next: (data) => {
          this.products = data;
        },
        error: (error) => {
          console.error('Erro ao buscar produtos:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao buscar produtos.',
          });
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  fetchCategories() {
    this.categoryService
      .getCategories()
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (error) => {
          console.error('Erro ao buscar categorias:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao buscar categorias.',
          });
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  get f() {
    return this.productForm.controls;
  }

  showAddProductDialog() {
    this.isEditing = false;
    this.productImage = '';
    this.displayAddProductDialog = true;
    this.productForm.reset();
  }

  hideAddProductDialog() {
    console.log('ma');
    this.displayAddProductDialog = false;
    this.submitted = false;
    this.productForm.reset();
    this.onFileClear();
  }

  confirmDeleteProduct(product: Product) {
    this.productToDelete = product;
    this.displayDeleteDialog = true;
  }

  deleteProduct() {
    if (this.productToDelete) {
      this.productService
        .deleteProduct(this.productToDelete.id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto excluído com sucesso.',
            });
            this.fetchProducts();
          },
          error: (error) => {
            console.error('Erro ao excluir produto:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao excluir produto.',
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
    this.productToDelete = null;
  }

  getCategoryName(category_id: number) {
    return this.categories.find((el) => el.id === category_id)?.name;
  }

  showEditProductDialog(product: Product): void {
    this.displayAddProductDialog = true;
    this.productForm.patchValue(product);
    this.isEditing = true;
    this.selectedProduct = product;
    this.optionCategoryModel = product?.category?.id;
    this.productImage = product.image;
    this.onFileClear();

    const imageControl = this.productForm.get('image');
    if (imageControl) {
      imageControl.clearValidators();
      imageControl.updateValueAndValidity();
    }
  }

  onSubmitProduct(): void {
    this.submitted = true;
    this.productForm.controls['seller_id'].setValue(localStorage.getItem('id'));

    if (this.productForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.productForm.controls).forEach((key) => {
      if (
        this.productForm.get(key)?.value !== null &&
        this.productForm.get(key)?.value !== undefined
      ) {
        formData.append(key, this.productForm.get(key)?.value);
      }
    });

    console.log(this.productForm.value);

    if (this.isEditing && this.selectedProduct) {
      this.productService
        .updateProduct(this.selectedProduct.id, formData)
        .subscribe({
          next: (data) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto atualizado com sucesso.',
            });
            this.fetchProducts();
          },
          error: (error) => {
            console.error('Erro ao atualizar produto:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao atualizar produto.',
            });
          },
          complete: () => {
            this.displayAddProductDialog = false;
            this.submitted = false;
            this.productForm.reset();
          },
        });
    } else {
      this.productService.register(formData).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto cadastrado com sucesso.',
          });
          this.fetchProducts();
        },
        error: (error) => {
          console.error('Erro ao criar produto:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao cadastrar produto.',
          });
        },
        complete: () => {
          this.displayAddProductDialog = false;
          this.submitted = false;
          this.productForm.reset();
        },
      });
    }
  }
}
