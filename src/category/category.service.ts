// src/category/category.service.ts
import { Injectable } from '@nestjs/common';

export interface Category {
  id: number;
  name: string;
}

@Injectable()
export class CategoryService {
  private categories: Category[] = [];
  private idCounter = 1;

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: number): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }

  create(data: { name: string }): Category {
    const newCategory: Category = {
      id: this.idCounter++,
      name: data.name,
    };
    this.categories.push(newCategory);
    return newCategory;
  }
}
