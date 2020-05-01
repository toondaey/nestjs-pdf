import { join } from 'path';
import { PDFModule } from '../../src/pdf.module';
import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class AppModule {
    static withRegister(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.register({
                    view: {
                        root: join(__dirname, '../assets/pdf'),
                        engine: 'pug',
                    },
                }),
            ],
        };
    }

    static withRegisterAsync(): DynamicModule {
        return {
            module: AppModule,
            imports: [
                PDFModule.registerAsync({
                    useFactory: () => ({
                        view: {
                            root: join(__dirname, '../assets/pdf'),
                            engine: 'pug',
                        },
                    }),
                }),
            ],
        };
    }
}
