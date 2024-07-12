import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../models/sale.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChartModule, PanelModule, TableModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  salesHistory!: any[];
  salesCategoriesData: any;
  bestSellingProductsData: any;

  constructor(private saleService: SaleService) {}

  ngOnInit() {
    this.loadSalesData();
  }

  loadSalesData() {
    this.saleService.getSales().subscribe((data) => {
      this.salesHistory = data.map((sale) => ({
        date: sale.date,
        productName: sale.product.name,
        customer: sale.user.name,
        seller: sale.seller.name,
      }));

      this.prepareSalesCategoriesData(data);
      this.prepareBestSellingProductsData(data);
    });
  }

  prepareSalesCategoriesData(data: any[]) {
    const categoriesCount: any = {};
    data.forEach((sale) => {
      const categoryName = sale.product.category.name;
      categoriesCount[categoryName] =
        (categoriesCount[categoryName] || 0) + sale.quantity;
    });

    this.salesCategoriesData = {
      labels: Object.keys(categoriesCount),
      datasets: [
        {
          data: Object.values(categoriesCount),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };
  }

  prepareBestSellingProductsData(data: any[]) {
    const productsCount: any = {};
    data.forEach((sale) => {
      const productName = sale.product.name;
      productsCount[productName] =
        (productsCount[productName] || 0) + sale.quantity;
    });

    this.bestSellingProductsData = {
      labels: Object.keys(productsCount),
      datasets: [
        {
          label: 'Vendas',
          data: Object.values(productsCount),
          backgroundColor: '#42A5F5',
        },
      ],
    };
  }
}
