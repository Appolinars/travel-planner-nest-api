import { Controller, Get } from '@nestjs/common';

import { pdfMockData } from './mocks/pdf-example.mock';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('/test-html-to-pdf') async exportTestPDF() {
    const pdfUrl = await this.pdfService.testHtmlToPdf(pdfMockData);
    return { url: pdfUrl };
  }

  @Get('/test-previewHtml')
  async previewTestHtml() {
    const htmlString = await this.pdfService.testGetPreviewHtml(pdfMockData);
    return htmlString;
  }
}
