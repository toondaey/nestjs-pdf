import { Readable } from 'stream';

import { CreateOptions } from 'html-pdf';
import { Options as JuiceOptions } from 'juice';
import { Type, Abstract } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

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

type ViewEngineOptions = { cache: boolean; [options: string]: any };

export interface PDFModuleOptions {
    view: ViewOptions;
    juice?: JuiceOptions;
}

export interface PDFRegisterOptions extends PDFModuleOptions {
    name?: string;
}

export interface PDFOptionsFactory {
    createPdfOptions(): PDFModuleOptions;
}

export interface PDFModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useClass?: Type<PDFOptionsFactory>;
    useExisting?: Type<PDFOptionsFactory>;
    useFactory?: (...args: any[]) => PDFModuleOptions;
    inject?: Array<string | symbol | Function | Type<any> | Abstract<any>>;
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

export { ViewEngineOptions, JuiceOptions };
