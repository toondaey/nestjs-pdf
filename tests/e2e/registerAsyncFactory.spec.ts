import {
    testPdfFn,
    testGenerateFn,
    testPdfOptionFn,
} from '../common/tests.common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('registerAsync() => useFactory', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule.withUseFactoryRegisterAsync()],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('should register pdf options asynchronously', () => {
        testPdfOptionFn(app);
    });

    it('should create pdf function', () => {
        testPdfFn(app);
    });

    it('should generate pdf file from template', async () => {
        await testGenerateFn(app);
    });

    afterEach(async () => {
        await app.close();
    });
});
