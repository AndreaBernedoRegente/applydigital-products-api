import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue({
              data: [],
              total: 0,
              page: 1,
              limit: 5,
              totalPages: 0,
            }),
            softDelete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return paginated products', async () => {
    const result = await controller.findAll({});
    expect(result).toHaveProperty('data');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should soft delete a product', async () => {
    const response = await controller.softDelete('someid');
    expect(response).toEqual({ message: 'Product deleted successfully' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.softDelete).toHaveBeenCalledWith('someid');
  });
});
