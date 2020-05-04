# Nestjs PDF Generator

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="" target="blank"><img src="pdf-icon.svg" width="120" alt="PDF Logo" /></a>
</p>

<p style='text-align:center;'>
A simple PDF generator module for <a href="https://nestjs.com">nestjs<a/> framework.
<p/>

<p align='center'>
    <a href="https://www.npmjs.com/package/nestjs-pdf" target='_blank'><img alt="npm" src="https://img.shields.io/npm/dm/nestjs-pdf" alt="NPM Downloads"></a>
    <a href="https://coveralls.io/github/toondaey/nestjs-pdf" target="_blank" rel="noopener noreferrer"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/toondaey/nestjs-pdf"></a>
    <a href="https://npmjs.com/nestjs-pdf" target="_blank" rel="noopener noreferrer"><img alt="npm version" src="https://img.shields.io/npm/v/nestjs-pdf"></a>
    <a href="https://npmjs.com/nestjs-pdf" target="_blank" rel="noopener noreferrer"><img alt="LICENCE" src="https://img.shields.io/npm/l/nestjs-pdf"></a>
    <a href="https://circleci.com/gh/toondaey/nestjs-pdf" target="_blank" rel="noopener noreferrer"><img alt="CircleCI build" src="https://img.shields.io/circleci/build/gh/toondaey/nestjs-pdf/master"></a>
<p/>

<details>
<summary><strong>Table of content</strong> (click to expand)</summary>

<!-- toc -->
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
<!-- tocstop -->
</details>

## Installation

Installation is as simple as running:  

`npm install nestjs-pdf`

or  

`yarn add nestjs-pdf`.

## Usage

A basic usage example:

1. Register the module as a dependency in the module where pdf will be generated:

`app.module.ts`
```ts
import { Module } from '@nestjs/common';
import { PDFModule } from '../../src/pdf.module';

@Module({
    imports: [
        // ... other modules
        PDFModule.register({
            view: {
                root: '/path/to/template',
                engine: 'pug',
            },
        }),
    ]
})
export class AppModule { };
```

The module could also be registered asynchronously using the `registerAsync` method. 

Examples below:

- Using factory provider approach
```ts
import { Module } from '@nestjs/common';
import { PDFModule, PDFModuleOptions, } from 'nestjs-pdf';

@Module({
    imports: [
        // ... other modules
        PDFModule.registerAsync({
            useFactory: (): PDFModuleOptions => ({
                view: {
                    root: '/path/to/template',
                    engine: 'pug',
                },
            })
        }),
    ]
})
export class AppModule { };
```

- Using class or existing provider approach:

`./pdf-config.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PDFOptionsFactory, PDFModuleOptions } from '../../src/pdf.interfaces';

@Injectable()
export class PdfConfigService implements PDFOptionsFactory {
    createPdfOptions(): PDFModuleOptions {
        return {
            view: {
                root: 'path/to/template',
                engine: 'pug',
            },
        };
    }
}
```

The `PdfConfigService` **SHOULD** implement the `PDFOptionsFactory`, **MUST** declare the `createPdfOptions` method and **MUST** return `PDFModuleOptions` object.

```ts
import { Module } from '@nestjs/common';
import { PdfConfigService } from './pdf-config.service';
import { PDFModule, PDFModuleOptions, } from 'nestjs-pdf';

@Module({
    imports: [
        // ... other modules
        PDFModule.registerAsync({
            useClass: PdfConfigService
        }),
    ]
})
export class AppModule { };
```

2. Inject into service as a dependency:

`app.service.ts`

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    constructor(
        // ...other dependencies...
        @InjectPdf() pdf: PDF,
    ) { }

    async generatePdf() {
        await this.pdf({
            filename: './filename.pdf', // where pdf will be generated. Generally comprises of the path and filename
            template: 'templateName',
        }); // This will generate the pdf file at process.cwd() + './filename.pdf'.
    }
}
```

## Configuration

### Module options

This library uses the [html-pdf](https://github.com/marcbachmann/node-html-pdf) npm package by **marcbachmann** under the hood which in turn uses [phantomjs](https://github.com/ariya/phantomjs) by **ariya** for the html-to-pdf conversion, [consolidate](https://github.com/tj/consolidate.js) by **tj** as html engine parser allowing users to specify their desired engine, as well as [juice](https://github.com/Automattic/juice) by **Automattic** for inlining resources.

The configuration object received by the `register` method is as below:

```ts
export interface PDFModuleOptions {
    name?: string;
    view: ViewOptions;
    juice?: JuiceOptions;
}
```

The `name` option would be the name of the module used for retrieval from the dependencies tree.

The `ViewOptions` can be further broken down into:

```ts
export interface ViewOptions {
    root: string;
    engine: engine;
    extension?: string;
    engineOptions?: ViewEngineOptions;
}
```

where:
- `root` (required) is the location of the template(s). This **MUST** be a directory.
- `engine` (required) **MUST** be a string name of the engines supported by the `consolidate` engine parser listed [here](https://github.com/tj/consolidate.js#supported-template-engines).
- `extension` (optional) **SHOULD** be provided where the file extension of the engine used is different from its name. e.g. a `swig` template would use `.html` as its file extension which is quite different from the engine name. Detailed example found [here](https://github.com/node-swig/swig-templates/tree/master/examples/basic)
- `engineOptions` (optional) is a JavaScript object representation of the configuration options of engine used.


The `JuiceOptions` is exactly the same as required in the `juice` package specifications [here](https://github.com/Automattic/juice#options).

### PDF method options

The options received by the pdf function is as below:

```ts
import { CreateOptions } from 'html-pdf';

export interface PdfOptions extends CreateOptions {
    filename?: string;
    template: string;
    viewportSize?: ViewPortSize;
    locals?: {
        [key: string]: any;
    };
}
```

This is an extension of the `CreateOptions` as provided by the [@types/html-pdf](https://www.npmjs.com/package/@types/html-pdf).

The `filename` (optional) options **MUST** be a string. This should be the path to the pdf file (created when pdf is generated) to be generated. Where `filename` is not given the file will be generated at:

```ts
import { join } from "path";
import { tmpdir } from "os";

join(tmpdir(), `html-pdf-${process.pid}.pdf`);
```

The `template` (required) option is the name the directory housing the template `html`. This **MUST** be a directory (name) available in the `root` directory provided in the `ViewOptions`. The directory must provide a `html.<extension>` file. i.e. if using pug engine, the directory must provide a `html.pug` file.

The `viewportSize` (optional) option is used to simulate the view of the screen when the pdf is grabbed. 

The `locals` (optional) option is an object that provides variables accessible within the html template(s).

## Contributing

Contributions are welcome.
