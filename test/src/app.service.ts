import { Injectable } from '@nestjs/common';
import { FileInfo } from 'html-pdf';
import { Observable } from 'rxjs';
import { Readable } from 'stream';

import { PDFOptions } from '../../lib';
import { PDFService } from '../../lib/pdf.service';

@Injectable()
export class AppService {
    constructor(private readonly pdfService: PDFService) {}
    generatePDFToFile(
        template: string,
        filename?: string,
        options?: PDFOptions,
    ): Observable<FileInfo> {
        return this.pdfService.toFile(template, filename, options);
    }

    generatePDFToStream(
        template: string,
        options?: PDFOptions,
    ): Observable<Readable> {
        new Observable().subscribe;
        return this.pdfService.toStream(template, options);
    }

    generatePDFToBuffer(
        template: string,
        options?: PDFOptions,
    ): Observable<Buffer> {
        return this.pdfService.toBuffer(template, options);
    }
}
