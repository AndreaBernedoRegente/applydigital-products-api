import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: {
            getDeletedPercentage: jest.fn().mockResolvedValue({
              total: 10,
              deleted: 2,
              percentage: '20.00%',
            }),
            getNonDeletedPercentage: jest.fn().mockResolvedValue({
              total: 8,
              filtered: 4,
              percentage: '50.00%',
            }),
            getAveragePrice: jest.fn().mockResolvedValue({ averagePrice: 100 }),
          },
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should return deleted percentage', async () => {
    const result = await controller.getDeletedPercentage();
    expect(result).toHaveProperty('percentage');
    expect(service.getDeletedPercentage).toHaveBeenCalled();
  });

  it('should return non-deleted percentage', async () => {
    const result = await controller.getNonDeletedPercentage(
      undefined,
      undefined,
      undefined,
    );
    expect(result).toHaveProperty('percentage');
    expect(service.getNonDeletedPercentage).toHaveBeenCalled();
  });

  it('should return average price', async () => {
    const result = await controller.getAveragePrice();
    expect(result).toHaveProperty('averagePrice');
    expect(service.getAveragePrice).toHaveBeenCalled();
  });
});
