import { Module } from '@nestjs/common';

import { PDFConfigService } from './pdf-config.service';

@Module({
    providers: [PDFConfigService],
    exports: [PDFConfigService],
})
export class ExistingModule {}
