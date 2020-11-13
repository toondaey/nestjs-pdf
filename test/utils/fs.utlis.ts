import { unlinkSync } from 'fs';

export function rmFile(path: string) {
    unlinkSync(path);
}
