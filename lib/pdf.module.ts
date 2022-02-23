import {
    Type,
    Module,
    DynamicModule,
    Provider,
} from '@nestjs/common';

import {
    PDFOptionsFactory,
    PDFModuleRegisterOptions,
    PDFModuleRegisterAsyncOptions,
} from './pdf.interfaces';
import { PDFService } from './pdf.service';
import { PDF_OPTIONS_TOKEN } from './pdf.constants';

@Module({
    providers: [PDFService],
    exports: [PDFService],
})
export class PDFModule {
    static register(
        options: PDFModuleRegisterOptions,
    ): DynamicModule {
        return {
            global: options.isGlobal,
            module: PDFModule,
            providers: [
                {
                    provide: PDF_OPTIONS_TOKEN,
                    useValue: options,
                },
            ],
        };
    }

    static registerAsync(
        options: PDFModuleRegisterAsyncOptions,
    ): DynamicModule {
        return {
            global: options.isGlobal,
            module: PDFModule,
            providers: [...this.createAsyncProviders(options)],
            imports: options.imports || [],
        };
    }

    static createAsyncProviders(
        options: PDFModuleRegisterAsyncOptions,
    ): Provider[] {
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
        options: PDFModuleRegisterAsyncOptions,
    ): Provider {
        if (options.useFactory) {
            return {
                provide: PDF_OPTIONS_TOKEN,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        const inject = [
            (options.useClass ||
                options.useExisting) as Type<PDFOptionsFactory>,
        ];

        return {
            provide: PDF_OPTIONS_TOKEN,
            useFactory: (factory: PDFOptionsFactory) =>
                factory.createPdfOptions(),
            inject,
        };
    }
}
