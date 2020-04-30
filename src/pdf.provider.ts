import {
    getPdfToken,
    getHtmlPdfOptionsToken,
} from "./utils";
import pify from "pify";
import {
    PdfOptions,
    PDFModuleOptions,
} from "./pdf.interfaces";
import { join } from "path";
import {juiceResources} from "juice";
import consolidate from "consolidate";
import { promisifyAll } from "bluebird";
import pdf, { FileInfo } from "html-pdf";
import { ValueProvider, FactoryProvider } from "@nestjs/common";

promisifyAll(pdf);

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
        useFactory: async (
            pdfModuleOptions: PDFModuleOptions,
        ) =>
            async (options: PdfOptions): Promise<FileInfo> => {
                const { view, juice: juiceOptions } = pdfModuleOptions;
                const { template, locals, ...createOptions } = options;

                const raw = join(
                    view.root,
                    template,
                    `html.${view.extension || view.engine}`
                );

                const html = await (consolidate as any)[view.engine](
                    raw,
                    Object.assign({}, locals, view.engineOptions)
                );

                const juiced = await pify(juiceResources)(html, juiceOptions);

                return (pdf as any).createAsync(juiced, createOptions);
            },
        inject: [getHtmlPdfOptionsToken(name),]
    };
}
