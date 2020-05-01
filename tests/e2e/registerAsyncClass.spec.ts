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
    let moduleName = 'test';

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule.withUseClassRegisterAsync(moduleName)],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('should register pdf options asynchronously', () => {
        testPdfOptionFn(app, moduleName);
    });

    it('should create pdf function', () => {
        testPdfFn(app, moduleName);
    });

    it('should generate pdf file from template', async () => {
        await testGenerateFn(app, moduleName);
    });

    afterEach(async () => {
        await app.close();
    });
});
