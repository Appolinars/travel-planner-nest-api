import { Inject, Injectable } from '@nestjs/common';
import { render } from 'ejs';
import { Response } from 'express';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import puppeteer from 'puppeteer-core';

// import { launch } from 'puppeteer';
import { Expense } from '../itineraries/entities/expense.entity';
import { ActivitiesService } from '../itineraries/services/activities.service';
import { ExpensesService } from '../itineraries/services/expenses.service';
import { ItinerariesService } from '../itineraries/services/itineraries.service';
import {
  IActivityResponse,
  IItineraryResponse,
} from '../itineraries/types/itineraries.types';

interface IItineraryPdfPayload {
  itinerary: IItineraryResponse;
  activities: IActivityResponse[];
  expenses: Expense[];
}

@Injectable()
export class PdfService {
  constructor(
    @Inject() private readonly itinerariesService: ItinerariesService,
    @Inject() private readonly activitiesService: ActivitiesService,
    @Inject() private readonly expensesService: ExpensesService,
  ) {}

  async generateItinerary(itinerary_id: number, res: Response) {
    const htmlContent = await this.getItineraryHtmlPreview(itinerary_id);
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io?token=2SQ9b7qHDBjbve540c189a243528896b2a546c82b34bace34`,
    });

    // const browser = await launch({
    //   headless: 'shell',
    //   args: [
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox',
    //     '--font-render-hinting=none',
    //   ],
    // });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="itinerary-${itinerary_id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
    // const pdfFileName = `itinerary-${itinerary_id}-${Date.now()}.pdf`;
    // const pdfFilePath = resolve(process.cwd(), 'pdfs', pdfFileName);
    // writeFileSync(pdfFilePath, pdfBuffer);
    // return `http://localhost:5000/pdfs/${pdfFileName}`;
  }

  async getItineraryHtmlPreview(itinerary_id: number) {
    const itineraryData = await this.prepareItineraryData(itinerary_id);

    const templatePath = resolve(
      process.cwd(),
      'src/templates',
      'itinerary.template.ejs',
    );

    if (!existsSync(templatePath)) {
      throw new Error(`Template file '${templatePath}' not found.`);
    }

    const template = readFileSync(templatePath, 'utf-8');

    const htmlContent = render(template, { data: itineraryData });
    return htmlContent;
  }

  private async prepareItineraryData(itinerary_id: number) {
    const itinerary = await this.itinerariesService.findOne(itinerary_id);
    const activities =
      await this.activitiesService.findByItineraryId(itinerary_id);
    const expenses = await this.expensesService.findByItineraryId(itinerary_id);

    const payload: IItineraryPdfPayload = {
      itinerary,
      activities,
      expenses,
    };

    return payload;
  }

  /* TEST */

  async testHtmlToPdf(data: any) {
    const htmlContent = this.testGetPreviewHtml(data);
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://production-sfo.browserless.io?token=2SQ9b7qHDBjbve540c189a243528896b2a546c82b34bace34`,
    });
    // const browser = await launch({
    //   headless: 'shell',
    //   args: [
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox',
    //     '--font-render-hinting=none',
    //   ],
    // });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const headerImgPath = join(
      process.cwd(),
      'src/templates/assets',
      'logo-test.jpg',
    );
    const headerImgBase64 = readFileSync(headerImgPath, 'base64');
    const headerImg = `data:image/jpeg;base64,${headerImgBase64}`;
    const headerTemplate = `
        <div style="position:fixed;left:12px;top:10px;">
        <img src="${headerImg}" alt="Header Image" style="width: 120px; height: 70px;" />
        </div>
    `;

    const footerTemplate = `
        <div style="position:fixed;left:20px;right:20px;bottom:13px;text-align: center; font-size: 10px;color:#ccc;padding-top:3px;border-top:1px solid #e9e7e7;">
            Neo Luo - Full stack developer
        </div> `;

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
    });

    await browser.close();
    const pdfFileName = `report-${Date.now()}.pdf`;
    const pdfFilePath = resolve(process.cwd(), 'pdfs', pdfFileName);
    writeFileSync(pdfFilePath, pdfBuffer);
    return `http://localhost:5000/pdfs/${pdfFileName}`;
  }

  testGetPreviewHtml(mockData: any) {
    const templatePath = resolve(
      process.cwd(),
      'src/templates',
      'test.template.ejs',
    );

    if (!existsSync(templatePath)) {
      throw new Error(`Template file '${templatePath}' not found.`);
    }
    const template = readFileSync(templatePath, 'utf-8');

    const htmlContent = render(template, { data: mockData });
    return htmlContent;
  }
}
