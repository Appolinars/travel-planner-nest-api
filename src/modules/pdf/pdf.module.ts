import { Module } from '@nestjs/common';

import { ItinerariesModule } from '../itineraries/itineraries.module';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';

@Module({
  controllers: [PdfController],
  providers: [PdfService],
  imports: [ItinerariesModule],
})
export class PdfModule {}
