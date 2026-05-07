// src/graphql/resolvers/product.codefirst.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductService } from '../../product/product.service';
import { ProductType } from '../types/product.type';

@Resolver(() => ProductType)
export class ProductCodeFirstResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductType])
  products(): ProductType[] {
    return this.productService.findAll() as ProductType[];
  }

  @Query(() => ProductType, { nullable: true })
  product(@Args('id') id: number): ProductType | undefined {
    return this.productService.findOne(id) as ProductType;
  }
  @Query(() => [ProductType])
  productsByCategory(@Args('categoryId') categoryId: number): ProductType[] {
    return this.productService
      .findAll()
      .filter((p) => p.categoryId === categoryId) as ProductType[];
  }

  @Mutation(() => ProductType)
  createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
    @Args('categoryId') categoryId: number,
  ): ProductType {
    return this.productService.create({
      name,
      price,
      categoryId,
    }) as ProductType;
  }
}
