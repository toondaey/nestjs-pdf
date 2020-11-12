import { join } from 'path';
import { tmpdir } from 'os';
import { Readable } from 'stream';

import { FileInfo } from 'html-pdf';
import { Test, TestingModule } from '@nestjs/testing';

import { PDF } from '../../lib/pdf';
import { getPdfToken } from '../../lib';
import { rmFile } from '../utils/fs.utlis';
import { AppModule } from '../src/app.module';
import { AppService } from '../src/app.service';

describe('PDFModule', () => {
    let module: TestingModule;
    let moduleName = 'test';

    describe('register()', () => {
        let filename: string;
        let pdf: PDF;

        beforeEach(async () => {
            module = await Test.createTestingModule({
                providers: [AppService],
                imports: [AppModule.withRegister()],
            }).compile();

            pdf = module.get<PDF>(getPdfToken());
        });

        afterEach(() => rmFile(filename));

        it('should be defined', () => {
            expect(module.get<PDF>(getPdfToken())).toBeDefined();
        });

        it('should generate pdf file from template', complete => {
            filename = join(tmpdir(), 'test.pdf');

            pdf.toFile('test', filename, {
                locals: { name: 'Toonday' },
            }).subscribe({
                next(file: FileInfo) {
                    expect(file.filename).toBe(filename);
                },
                complete,
            });
        });

        it('should generate pdf stream from template', complete => {
            pdf.toStream('test').subscribe({
                next(stream: Readable) {
                    expect(stream instanceof Readable).toBe(true);
                },
                complete,
            });
        });

        it('should generate pdf buffer from template', complete => {
            pdf.toBuffer('test').subscribe({
                next(buffer: Buffer) {
                    expect(Buffer.isBuffer(buffer)).toBe(true);
                },
                complete,
            });
        });
    });

    describe('registerAsync()', () => {
        describe('useFactory()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [
                        AppModule.withUseFactoryRegisterAsync(moduleName),
                    ],
                }).compile();

                expect(module.get<PDF>(getPdfToken(moduleName))).toBeDefined();
            });
        });

        describe('useClass()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withUseClassRegisterAsync(moduleName)],
                }).compile();

                expect(module.get<PDF>(getPdfToken(moduleName))).toBeDefined();
            });
        });

        describe('useExisting()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [
                        AppModule.withUseExistingRegisterAsync(moduleName),
                    ],
                }).compile();

                expect(module.get<PDF>(getPdfToken(moduleName))).toBeDefined();
            });
        });
    });
});
