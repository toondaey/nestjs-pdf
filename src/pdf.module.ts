import { createPdfProvider, createPdfOptionsProvider } from './pdf.provider';
import {
    PDFModuleOptions,
    PDFOptionsFactory,
    PDFModuleAsyncOptions,
} from './pdf.interfaces';
import { getPdfToken, getHtmlPdfOptionsToken } from './utils';
import { Module, DynamicModule, Provider, Type } from '@nestjs/common';

@Module({})
export class PDFModule {
    static register(options: PDFModuleOptions): DynamicModule {
        const { name, ...otherOptions } = options;

        return {
            module: PDFModule,
            providers: [
                createPdfOptionsProvider(otherOptions, name),
                createPdfProvider(name),
            ],
            exports: [getPdfToken(name)],
        };
    }

    static registerAsync(options: PDFModuleAsyncOptions): DynamicModule {
        return {
            module: PDFModule,
            providers: [
                createPdfProvider(options.name),
                ...this.createAsyncProviders(options),
            ],
            imports: options.imports || [],
        };
    }

    static createAsyncProviders(options: PDFModuleAsyncOptions): Provider[] {
        if (options.useFactory || options.useExisting) {
            return [this.createAsyncOptionsProvider(options)];
        }

        const useClass = options.useClass as Type<PDFOptionsFactory>;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }

    static createAsyncOptionsProvider(
        options: PDFModuleAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: getHtmlPdfOptionsToken(options.name),
                useFactory: options.useFactory,
            };
        }

        const inject = [
            (options.useClass || options.useExisting) as Type<
                PDFOptionsFactory
            >,
        ];
        return {
            provide: getHtmlPdfOptionsToken(options.name),
            useFactory: (factory: PDFOptionsFactory) =>
                factory.createPdfOptions(),
            inject,
        };
    }
}
