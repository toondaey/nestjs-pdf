import { Readable } from 'stream';

import {
    ModuleMetadata,
    FactoryProvider,
} from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';
import { Options as JuiceOptions } from 'juice';
import { Observable, SchedulerLike } from 'rxjs';
import { CreateOptions, FileInfo } from 'html-pdf';

export type engine =
    | 'arc-templates'
    | 'atpl'
    | 'bracket'
    | 'dot'
    | 'dust'
    | 'eco'
    | 'ejs'
    | 'ect'
    | 'haml'
    | 'haml-coffee'
    | 'hamlet'
    | 'handlebars'
    | 'hogan'
    | 'htmling'
    | 'jade'
    | 'jazz'
    | 'jqtpl'
    | 'just'
    | 'liquid'
    | 'liquor'
    | 'lodash'
    | 'marko'
    | 'mote'
    | 'mustache'
    | 'nunjucks'
    | 'plates'
    | 'pug'
    | 'qejs'
    | 'ractive'
    | 'razor'
    | 'react'
    | 'slm'
    | 'squirrelly'
    | 'swig'
    | 'teacup'
    | 'templayed'
    | 'toffee'
    | 'twig'
    | 'underscore'
    | 'vash'
    | 'velocityjs'
    | 'walrus'
    | 'whiskers';

type ViewEngineOptions = {
    cache: boolean;
    [options: string]: any;
};

export interface PDFModuleOptions {
    view: ViewOptions;
    juice?: JuiceOptions;
}

export interface PDFModuleRegisterOptions extends PDFModuleOptions {
    isGlobal?: boolean;
}

export interface PDFOptionsFactory {
    createPdfOptions(): PDFModuleOptions;
}

export interface PDFModuleRegisterAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    isGlobal?: boolean;
    useClass?: Type<PDFOptionsFactory>;
    useExisting?: Type<PDFOptionsFactory>;
    useFactory?: (...args: any[]) => PDFModuleOptions;
    inject?: Extract<FactoryProvider, 'inject'>;
}

export interface ViewOptions {
    root: string;
    engine: engine;
    extension?: string;
    engineOptions?: ViewEngineOptions;
}

export interface ViewPortSize {
    width?: number;
    height?: number;
}

export interface PDFOptions extends CreateOptions {
    viewportSize?: ViewPortSize;
    locals?: Record<string, any>;
}

export interface PDF {
    toFile(
        template: string,
        filename?: string,
        options?: PDFOptions,
        scheduler?: SchedulerLike,
    ): Observable<FileInfo>;

    toStream(
        template: string,
        options?: PDFOptions,
        scheduler?: SchedulerLike,
    ): Observable<Readable>;

    toBuffer(
        template: string,
        options?: PDFOptions,
        scheduler?: SchedulerLike,
    ): Observable<Buffer>;
}

export { ViewEngineOptions, JuiceOptions };
