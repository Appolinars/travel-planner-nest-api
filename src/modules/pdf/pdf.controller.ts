import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { pdfMockData } from './mocks/pdf-example.mock';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('/itinerary/:id')
  async generateItineraryPdf(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.pdfService.generateItinerary(+id, response);
    // const pdfUrl = await this.pdfService.generateItinerary(+id, response);
    // return { url: pdfUrl };
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
