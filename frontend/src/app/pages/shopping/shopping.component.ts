import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { environment } from '../../../environments/environment.development';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ShoppingService } from '../../services/shopping.service';
import { Sale } from '../../models/sale.model';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    DataViewModule,
    ButtonModule,
    TagModule,
    InputNumberModule,
    CommonModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  providers: [ProductService, MessageService, ShoppingService],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.css',
})
export class ShoppingComponent {
  layout: any = 'grid';
  products!: Product[];
  imageDir = environment.imageDir;
  loading: boolean = false;
  qtdProduct: number = 0;
  displayConfirmationDialog: boolean = false;
  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private shoppingService: ShoppingService
  ) {}

  ngOnInit() {
    this.fetchProducts();
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
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  getSeverity(
    product: Product
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    if (product.stock_quantity > 5) {
      return 'success';
    } else if (product.stock_quantity > 0 && product.stock_quantity <= 5) {
      return 'warning';
    } else if (product.stock_quantity === 0) {
      return 'danger';
    } else {
      return undefined;
    }
  }

  getSeverityTitle(product: Product): string {
    if (product.stock_quantity > 5) {
      return 'EM ESTOQUE';
    } else if (product.stock_quantity > 0 && product.stock_quantity <= 5) {
      return 'BAIXO ESTOQUE';
    } else if (product.stock_quantity === 0) {
      return 'FORA DE ESTOQUE';
    } else {
      return '';
    }
  }

  getImage(file: string): string {
    return `${this.imageDir}/${file}`;
  }

  buy(product: Product) {
    const formData = new FormData();
    formData.append('subtract_quantity', product.qtdProduct.toString());
    this.productService
      .updateProductStock(product.id, formData)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Compra realizada com sucesso.',
          });
          this.fetchProducts();
        },
        error: (error) => {
          console.error('Erro ao buscar produtos:', error);
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  openConfirmationDialog(product: Product): void {
    this.selectedProduct = product;
    this.displayConfirmationDialog = true;
  }

  validInput(product: Product) {
    if (!product.qtdProduct || product.stock_quantity === 0) {
      return true;
    }
    return false;
  }

  confirmPurchase() {
    if (this.selectedProduct) {
      console.log(this.selectedProduct);

      const data: Sale = {
        product_id: this.selectedProduct.id,
        quantity: this.selectedProduct.qtdProduct,
        seller_id: this.selectedProduct.seller.id,
        user_id: Number(localStorage.getItem('id')),
        total_price:
          Number(this.selectedProduct.price) * this.selectedProduct.qtdProduct,
      };

      this.shoppingService
        .purchase(data)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Compra realizada com sucesso.',
            });
            this.fetchProducts();
          },
          error: (error) => {
            console.error('Erro:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao comprar produto.',
            });
          },
        })
        .add(() => {
          this.loading = false;
          this.closeConfirmationDialog();
        });
    }
  }

  cancelPurchase(): void {
    this.closeConfirmationDialog();
  }

  closeConfirmationDialog(): void {
    this.displayConfirmationDialog = false;
    this.selectedProduct = null;
  }
}
