import { Test, TestingModule } from '@nestjs/testing';

import { ItinerariesService } from '../services/itineraries.service';
import { ItinerariesController } from './itineraries.controller';

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
