import { ValueProvider, FactoryProvider } from '@nestjs/common';

import { PDF } from './pdf';
import { PDFModuleOptions } from './pdf.interfaces';
import { getPdfToken, getHtmlPdfOptionsToken } from './utils';

export function createPdfOptionsProvider(
    options: Omit<PDFModuleOptions, 'name'>,
    name?: string,
): ValueProvider {
    return {
        provide: getHtmlPdfOptionsToken(name),
        useValue: options,
    };
}

export function createPdfProvider(name?: string): FactoryProvider {
    return {
        provide: getPdfToken(name),
        useFactory: async (pdfModuleOptions: PDFModuleOptions) =>
            new PDF(pdfModuleOptions),
        inject: [getHtmlPdfOptionsToken(name)],
    };
}
