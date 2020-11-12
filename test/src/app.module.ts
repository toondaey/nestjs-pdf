import { join } from 'path';

import { Module, DynamicModule } from '@nestjs/common';

import { PDFModule } from '../../lib/pdf.module';
import { ExistingModule } from './existing.module';
import { PDFConfigService } from './pdf-config.service';

const root = join(__dirname, '../assets/pdf');

@Module({
    exports: [PDFModule],
})
export class AppModule {
    static withRegister(name?: string): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.register({
                    name,
                    view: {
                        root,
                        engine: 'pug',
                    },
                }),
            ],
        };
    }

    static withUseFactoryRegisterAsync(name?: string): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.registerAsync({
                    name,
                    useFactory: () => ({
                        view: {
                            root,
                            engine: 'pug',
                        },
                    }),
                }),
            ],
        };
    }

    static withUseClassRegisterAsync(name?: string): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.registerAsync({
                    name,
                    useClass: PDFConfigService,
                    imports: [],
                }),
            ],
        };
    }

    static withUseExistingRegisterAsync(name?: string): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.registerAsync({
                    name,
                    useExisting: PDFConfigService,
                    imports: [ExistingModule],
                }),
            ],
        };
    }
}
