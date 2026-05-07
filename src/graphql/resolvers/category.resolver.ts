// src/graphql/resolvers/category.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryService } from '../../category/category.service';
import { CategoryType } from '../types/category.type';

@Resolver(() => CategoryType)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryType])
  categories(): CategoryType[] {
    return this.categoryService.findAll();
  }

  @Mutation(() => CategoryType)
  createCategory(@Args('name') name: string): CategoryType {
    return this.categoryService.create({ name });
  }
}
