import { Injectable } from '@nestjs/common';
import { render } from 'ejs';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { launch } from 'puppeteer';
// import * as ejs from 'ejs';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async testHtmlToPdf(data: any) {
    const htmlContent = this.testGetPreviewHtml(data);
    const browser = await launch({
      headless: 'shell',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=none',
      ],
    });

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
