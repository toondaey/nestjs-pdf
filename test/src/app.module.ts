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
    static withRegister(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.register({
                    isGlobal: true,
                    view: {
                        root,
                        engine: 'pug',
                    },
                }),
            ],
        };
    }

    static withUseFactoryRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.registerAsync({
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

    static withUseClassRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.registerAsync({
                    useClass: PDFConfigService,
                    imports: [],
                }),
            ],
        };
    }

    static withUseExistingRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.registerAsync({
                    useExisting: PDFConfigService,
                    imports: [ExistingModule],
                }),
            ],
        };
    }
}
