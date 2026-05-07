// src/product/product.service.ts
import { Injectable } from '@nestjs/common';

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

@Injectable()
export class ProductService {
  private products: Product[] = [];
  private idCounter = 1;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  create(data: { name: string; price: number; categoryId: number }): Product {
    const newProduct: Product = {
      id: this.idCounter++,
      name: data.name,
      price: data.price,
      categoryId: data.categoryId,
    };
    this.products.push(newProduct);
    return newProduct;
  }
}
