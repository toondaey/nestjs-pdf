import { Injectable } from '@nestjs/common';

import { PDF } from '../../lib/pdf';
import { InjectPDF } from '../../lib';

@Injectable()
export class AppService {
    constructor(@InjectPDF() pdf: PDF) {}
}
