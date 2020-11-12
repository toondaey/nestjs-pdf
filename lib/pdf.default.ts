import { join } from 'path';
import { tmpdir } from 'os';

export const defaultCreateOptions = {
    filename: join(tmpdir(), `html-pdf-${process.pid}.pdf`),
};
