import { join } from 'path';
import { tmpdir } from 'os';
import { Readable } from 'stream';

import { FileInfo } from 'html-pdf';
import { asapScheduler } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';

import { PDFService } from '../../lib';
import { rmFile } from '../utils/fs.utlis';
import { AppModule } from '../src/app.module';
import { AppService } from '../src/app.service';

describe('PDFModule', () => {
    let module: TestingModule;

    describe('register(...)', () => {
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

        describe('toFile(...)', () => {
            it('toFile(template, filename, options, scheduler)', complete => {
                filename = join(tmpdir(), 'test.pdf');

                appService
                    .generatePDFToFile(
                        'test',
                        filename,
                        {
                            locals: { name: 'Toonday' },
                        },
                        asapScheduler,
                    )
                    .subscribe({
                        next(file: FileInfo) {
                            expect(file.filename).toBe(filename);
                            // Tests that file was actually created.
                            expect(() =>
                                rmFile(filename),
                            ).not.toThrowError();
                        },
                        complete,
                    });
            });

            it('toFile(template, filename, options, )', complete => {
                filename = join(tmpdir(), 'test.pdf');

                appService
                    .generatePDFToFile(
                        'test',
                        filename,
                        {
                            locals: { name: 'Toonday' },
                        },
                        undefined,
                    )
                    .subscribe({
                        next(file: FileInfo) {
                            expect(file.filename).toBe(filename);
                            // Tests that file was actually created.
                            expect(() =>
                                rmFile(filename),
                            ).not.toThrowError();
                        },
                        complete,
                    });
            });

            it('toFile(template, filename)', complete => {
                filename = join(tmpdir(), 'test.pdf');

                appService
                    .generatePDFToFile('test', filename, undefined)
                    .subscribe({
                        next(file: FileInfo) {
                            expect(file.filename).toBe(filename);
                            // Tests that file was actually created.
                            expect(() =>
                                rmFile(filename),
                            ).not.toThrowError();
                        },
                        complete,
                    });
            });
        });

        describe('toStream(...)', () => {
            it('toStream(template, options)', complete => {
                appService.generatePDFToStream('test', {}).subscribe({
                    next(stream: Readable) {
                        expect(stream instanceof Readable).toBe(true);
                    },
                    complete,
                });
            });

            it('toStream(template)', complete => {
                appService
                    .generatePDFToStream('test', undefined)
                    .subscribe({
                        next(stream: Readable) {
                            expect(stream instanceof Readable).toBe(
                                true,
                            );
                        },
                        complete,
                    });
            });
        });

        describe('toBuffer(...)', () => {
            it('toBuffer(template, options)', complete => {
                appService.generatePDFToBuffer('test', {}).subscribe({
                    next(buffer: Buffer) {
                        expect(Buffer.isBuffer(buffer)).toBe(true);
                    },
                    complete,
                });
            });

            it('toBuffer(template)', complete => {
                appService
                    .generatePDFToBuffer('test', undefined)
                    .subscribe({
                        next(buffer: Buffer) {
                            expect(Buffer.isBuffer(buffer)).toBe(
                                true,
                            );
                        },
                        complete,
                    });
            });
        });
    });

    describe('registerAsync(...)', () => {
        describe('useFactory(...)', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [
                        AppModule.withUseFactoryRegisterAsync(),
                    ],
                }).compile();

                expect(
                    module.get<PDFService>(PDFService),
                ).toBeDefined();
            });
        });

        describe('useClass(...)', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [AppModule.withUseClassRegisterAsync()],
                }).compile();

                expect(
                    module.get<PDFService>(PDFService),
                ).toBeDefined();
            });
        });

        describe('useExisting(...)', () => {
            it('should register module', async () => {
                module = await Test.createTestingModule({
                    imports: [
                        AppModule.withUseExistingRegisterAsync(),
                    ],
                }).compile();

                expect(
                    module.get<PDFService>(PDFService),
                ).toBeDefined();
            });
        });
    });
});
