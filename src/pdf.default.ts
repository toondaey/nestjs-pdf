import { join } from 'path';
import { tmpdir } from 'os';
import { PdfOptions } from './pdf.interfaces';

export const defaultCreateOptions = {
    filename: join(tmpdir(), `html-pdf-${process.pid}.pdf`),
} as Omit<PdfOptions, 'template'>;
