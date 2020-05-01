import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { PDFOptionsFactory, PDFModuleOptions } from '../../src/pdf.interfaces';

@Injectable()
export class PdfConfigService implements PDFOptionsFactory {
    createPdfOptions(): PDFModuleOptions {
        return {
            view: {
                root: join(__dirname, '../assets/pdf'),
                engine: 'pug',
            },
        };
    }
}
