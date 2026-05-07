// src/category/category.module.ts
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from '../graphql/resolvers/category.resolver';

@Module({
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
