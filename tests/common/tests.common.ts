import { join } from 'path';
import { tmpdir } from 'os';
import { existsSync } from 'fs';
import { rmFile } from '../utils/fs.utlis';
import { INestApplication } from '@nestjs/common';
import { getHtmlPdfOptionsToken, getPdfToken, PDF } from '../../src';

export function testPdfOptionFn(app: INestApplication) {
    const config = app.get(getHtmlPdfOptionsToken());

    expect(config).not.toBeNull();
    expect(config).not.toBeUndefined();
}

export function testPdfFn(app: INestApplication) {
    const pdf = app.get(getPdfToken());

    expect(pdf).not.toBeNull();
    expect(pdf).not.toBeUndefined();
}

export async function testGenerateFn(app: INestApplication) {
    const pdf = app.get(getPdfToken()) as PDF;
    const filename = join(tmpdir(), 'test.pdf');

    rmFile(filename);

    await pdf({
        filename,
        template: 'test',
    });

    expect(existsSync(filename)).toBeTruthy();
}
