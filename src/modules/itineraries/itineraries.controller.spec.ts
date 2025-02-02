import { Test, TestingModule } from '@nestjs/testing';

import { ItinerariesController } from './itineraries.controller';
import { ItinerariesService } from './itineraries.service';

describe('ItinerariesController', () => {
  let controller: ItinerariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItinerariesController],
      providers: [ItinerariesService],
    }).compile();

    controller = module.get<ItinerariesController>(ItinerariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
