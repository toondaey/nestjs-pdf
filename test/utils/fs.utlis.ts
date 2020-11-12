import { unlinkSync } from 'fs';

export function rmFile(path: string) {
    try {
        unlinkSync(path);
    } catch (e) {
        //
    }
}
