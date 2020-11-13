import { join } from 'path';
import { tmpdir } from 'os';
import { existsSync } from 'fs';

import { FileInfo } from 'html-pdf';
import { INestApplication } from '@nestjs/common';

import { rmFile } from '../utils/fs.utlis';
import { getHtmlPdfOptionsToken, getPdfToken, PDF } from '../../src';

export function testPdfOptionFn(app: INestApplication, name?: string) {
    const config = app.get(getHtmlPdfOptionsToken(name));

    expect(config).not.toBeNull();
    expect(config).not.toBeUndefined();
}

export function testPdfFn(app: INestApplication, name?: string) {
    const pdf = app.get<PDF>(getPdfToken(name));

    expect(pdf).not.toBeNull();
    expect(pdf).not.toBeUndefined();
}

export function testGenerateFn(app: INestApplication, name?: string) {
    const pdf = app.get<PDF>(getPdfToken(name));
    const filename = join(__dirname, 'test.pdf');

    rmFile(filename);

    pdf.toBuffer({
        // filename,
        template: 'test',
    }).subscribe({
        next(file: Buffer) {
            expect(Buffer.isBuffer(file)).toBe(true);
        },
    });
}
