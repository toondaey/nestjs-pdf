import { getPdfToken } from "../utils";
import { Inject } from "@nestjs/common";

export const InjectPdf = (name?: string) => Inject(getPdfToken(name));
