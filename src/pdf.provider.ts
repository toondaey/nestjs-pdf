import { getPdfToken, getHtmlPdfOptionsToken } from './utils';
import pify from 'pify';
import { ValueProvider, FactoryProvider } from '@nestjs/common';
import { PdfOptions, PDFModuleOptions } from './pdf.interfaces';
import { join } from 'path';
import merge from 'lodash.merge';
import consolidate from 'consolidate';
import { juiceResources } from 'juice';
import pdf, { FileInfo } from 'html-pdf';
import { defaultCreateOptions } from './pdf.default';

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
        useFactory: async (pdfModuleOptions: PDFModuleOptions) => async (
            options: PdfOptions,
        ): Promise<FileInfo> => {
            const { view, juice: juiceOptions } = pdfModuleOptions;

            const { template, locals, ...createOptions } = options;

            const raw = join(
                view.root,
                template,
                `html.${view.extension || view.engine}`,
            );

            const html = await (consolidate as any)[view.engine](
                raw,
                Object.assign({}, locals, view.engineOptions),
            );

            const juiced = await pify(juiceResources)(html, juiceOptions);

            return pify(pdf.create)(
                juiced,
                merge(defaultCreateOptions, createOptions),
            );
        },
        inject: [getHtmlPdfOptionsToken(name)],
    };
}
