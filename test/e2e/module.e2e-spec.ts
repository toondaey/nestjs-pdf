import { join } from 'path';
import { tmpdir } from 'os';
import { Readable } from 'stream';

import { FileInfo } from 'html-pdf';
import { Test, TestingModule } from '@nestjs/testing';

import { PDFService } from '../../lib';
import { rmFile } from '../utils/fs.utlis';
import { AppModule } from '../src/app.module';
import { AppService } from '../src/app.service';

describe('PDFModule', () => {
    let module: TestingModule;
    let moduleName = 'test';

    describe('register()', () => {
        let filename: string;
        let appService: AppService;

        beforeEach(async () => {
            module = await Test.createTestingModule({
                providers: [AppService],
                imports: [AppModule.withRegister()],
            }).compile();

            appService = module.get<AppService>(AppService);
        });

        it('should be defined', () => {
            expect(module.get<PDFService>(PDFService)).toBeDefined();
        });

        it('should generate pdf file from template', complete => {
            filename = join(tmpdir(), 'test.pdf');

            appService
                .generatePDFToFile('test', filename, {
                    locals: { name: 'Toonday' },
                })
                .subscribe({
                    next(file: FileInfo) {
                        expect(file.filename).toBe(filename);
                        // Tests that file was actually created.
                        expect(() => rmFile(filename)).not.toThrowError();
                    },
                    complete,
                });
        });

        it('should generate pdf stream from template', complete => {
            appService.generatePDFToStream('test').subscribe({
                next(stream: Readable) {
                    expect(stream instanceof Readable).toBe(true);
                },
                complete,
            });
        });

        it('should generate pdf buffer from template', complete => {
            appService.generatePDFToBuffer('test').subscribe({
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

                expect(module.get<PDFService>(PDFService)).toBeDefined();
            });
        });

        describe('useClass()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withUseClassRegisterAsync(moduleName)],
                }).compile();

                expect(module.get<PDFService>(PDFService)).toBeDefined();
            });
        });

        describe('useExisting()', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [
                        AppModule.withUseExistingRegisterAsync(moduleName),
                    ],
                }).compile();

                expect(module.get<PDFService>(PDFService)).toBeDefined();
            });
        });
    });
});
