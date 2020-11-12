import { Module, DynamicModule, Provider, Type } from '@nestjs/common';

import { createPdfProvider, createPdfOptionsProvider } from './pdf.provider';

import {
    PDFOptionsFactory,
    PDFRegisterOptions,
    PDFModuleAsyncOptions,
} from './pdf.interfaces';
import { getPdfToken, getHtmlPdfOptionsToken } from './utils';

@Module({})
export class PDFModule {
    static register(options: PDFRegisterOptions): DynamicModule {
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
            exports: [getPdfToken(options.name)],
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
        const provide = getHtmlPdfOptionsToken(options.name);

        if (options.useFactory) {
            return {
                provide,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [
            (options.useClass || options.useExisting) as Type<
                PDFOptionsFactory
            >,
        ];

        return {
            provide,
            useFactory: (factory: PDFOptionsFactory) =>
                factory.createPdfOptions(),
            inject,
        };
    }
}
