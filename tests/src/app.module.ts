import { join } from 'path';
import { PDFModule } from '../../src/pdf.module';
import { Module, DynamicModule } from '@nestjs/common';
import { PdfConfigService } from './pdf-config.service';

@Module({})
export class AppModule {
    static withRegister(name?: string): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.register({
                    name,
                    view: {
                        root: join(__dirname, '../assets/pdf'),
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
                    useFactory: () => ({
                        name,
                        view: {
                            root: join(__dirname, '../assets/pdf'),
                            engine: 'pug',
                        },
                    }),
                    inject: [],
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
                    useClass: PdfConfigService,
                    imports: [],
                }),
            ],
        };
    }
}
