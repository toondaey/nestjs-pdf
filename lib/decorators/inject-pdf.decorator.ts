import { Inject } from '@nestjs/common';

import { getPdfToken } from '../utils';

export const InjectPDF = (name?: string) => Inject(getPdfToken(name));
