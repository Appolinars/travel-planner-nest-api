import { Controller, Get, Param } from '@nestjs/common';

import { pdfMockData } from './mocks/pdf-example.mock';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('/itinerary/:id')
  async generateItineraryPdf(@Param('id') id: string) {
    const pdfUrl = await this.pdfService.generateItinerary(+id);
    return { url: pdfUrl };
  }

  @Get('/itinerary-preview/:id')
  async getItineraryHtmlPreview(@Param('id') id: string) {
    const itineraryHtml = await this.pdfService.getItineraryHtmlPreview(+id);
    return itineraryHtml;
  }

  /* TEST */

  @Get('/test-html-to-pdf')
  async exportTestPDF() {
    const pdfUrl = await this.pdfService.testHtmlToPdf(pdfMockData);
    return { url: pdfUrl };
  }

  @Get('/test-previewHtml')
  async previewTestHtml() {
    const htmlString = await this.pdfService.testGetPreviewHtml(pdfMockData);
    return htmlString;
  }
}
