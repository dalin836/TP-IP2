// src/product/product.module.ts
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from '../graphql/resolvers/product.resolver';
import { CategoryService } from '../category/category.service';

@Module({
  providers: [ProductService, ProductResolver, CategoryService],
  exports: [ProductService],
})
export class ProductModule {}
