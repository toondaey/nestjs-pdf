# Nestjs PDF Generator

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
  <a href="" target="blank"><img src="https://raw.githubusercontent.com/toondaey/nestjs-pdf/master/pdf-icon.svg" width="120" alt="PDF Logo" /></a>
</p>

<p style='text-align:center;'>
A simple PDF generator module for <a href="https://nestjs.com">nestjs</a> framework.
</p>

<p align='center'>
    <a href="https://www.npmjs.com/package/@t00nday/nestjs-pdf" target='_blank'><img alt="npm" src="https://img.shields.io/npm/dm/@t00nday/nestjs-pdf" alt="NPM Downloads"></a>
    <a href="https://coveralls.io/github/toondaey/nestjs-pdf" target="_blank" rel="noopener noreferrer"><img alt="Coveralls github" src="https://img.shields.io/coveralls/github/toondaey/nestjs-pdf"></a>
    <a href="https://npmjs.com/@t00nday/nestjs-pdf" target="_blank" rel="noopener noreferrer"><img alt="npm version" src="https://img.shields.io/npm/v/@t00nday/nestjs-pdf"></a>
    <a href="https://npmjs.com/@t00nday/nestjs-pdf" target="_blank" rel="noopener noreferrer"><img alt="LICENCE" src="https://img.shields.io/npm/l/@t00nday/nestjs-pdf"></a>
    <a href="https://circleci.com/gh/toondaey/nestjs-pdf" target="_blank" rel="noopener noreferrer"><img alt="CircleCI build" src="https://img.shields.io/circleci/build/gh/toondaey/nestjs-pdf/master"></a>
</p>

<details>
<summary><strong>Table of content</strong> (click to expand)</summary>

<!-- toc -->

-   [Installation](#installation)
-   [Usage](#usage)
-   [Configuration](#configuration)
-   [Guide](#usage)
-   [Changelog](#changelog)
-   [Contributing](#contributing)
    <!-- tocstop -->
    </details>

## Installation

Installation is as simple as running:

`npm install @t00nday/nestjs-pdf`

or

`yarn add @t00nday/nestjs-pdf`.

## Usage

A basic usage example:

1. Register the module as a dependency in the module where pdf will be generated:

`app.module.ts`

```ts
import { Module } from '@nestjs/common';
import { PDFModule } from '@t00nday/nestjs-pdf';

@Module({
    imports: [
        // ... other modules
        PDFModule.register({
            view: {
                root: '/path/to/template',
                engine: 'pug',
            },
        }),
    ],
})
export class AppModule {}
```

The module could also be registered asynchronously using the `registerAsync` method.

Examples below:

-   Using factory provider approach

```ts
import { Module } from '@nestjs/common';
import { PDFModule, PDFModuleOptions } from '@t00nday/nestjs-pdf';

@Module({
    imports: [
        // ... other modules
        PDFModule.registerAsync({
            useFactory: (): PDFModuleOptions => ({
                view: {
                    root: '/path/to/template',
                    engine: 'pug',
                },
            }),
        }),
    ],
})
export class AppModule {}
```

-   Using class or existing provider approach:

`./pdf-config.service.ts`

```ts
import {
    PDFModuleOptions,
    PDFOptionsFactory,
} from '@t00nday/nestjs-pdf';
import { Injectable } from '@nestjs/common';

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
import { PDFModule } from '@t00nday/nestjs-pdf';
import { PdfConfigService } from './pdf-config.service';

@Module({
    imports: [
        // ... other modules
        PDFModule.registerAsync({
            useClass: PdfConfigService,
        }),
    ],
})
export class AppModule {}
```

2. Inject into service as a dependency:

`app.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PDFService } from '@t00nday/nestjs-pdf';

@Injectable()
export class AppService {
    constructor(
        // ...other dependencies...
        private readonly pdfService: PDFService,
    ) {}
}
```

In addition to the above, in situations where all your pdf templates are grouped into a single directory but you expect pdf files to be generated in multiple contexts within your nestjs application, it is advisable to register the PDFModule once in the root module of your application and providing it globally. This can be done by setting `isGlobal` to true either in the `PDFModuleRegisterOptions` or `PDFModuleRegisterAsyncOptions` as below:

```ts
@Module({
    imports: [
        PDFModule.register({
            isGlobal: true,
            view: {
                root: '/path/to/template',
                engine: 'pug',
            },
        })
        // or...
        PDFModule.registerAsync({
            isGlobal: true,
            useFactory: (): PDFModuleOptions => ({
                view: {
                    root: '/path/to/template',
                    engine: 'pug',
                },
            }),
        }),
    ]
})
export class RootModule {}
```

## Configuration

### Module options

This library uses the [html-pdf](https://github.com/marcbachmann/node-html-pdf) npm package by **marcbachmann** under the hood which in turn uses [phantomjs](https://github.com/ariya/phantomjs) by **ariya** for the html-to-pdf conversion, [consolidate](https://github.com/tj/consolidate.js) by **tj** as html engine parser allowing users to specify their desired engine, as well as [juice](https://github.com/Automattic/juice) by **Automattic** for inlining resources.

The configuration object received by the `register` method is as below:

```ts
export interface PDFModuleRegisterOptions {
    view: ViewOptions;
    juice?: JuiceOptions;
}
```

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

-   `root` (required) is the location of the template(s). This **MUST** be a directory.
-   `engine` (required) **MUST** be a string name of the engines supported by the `consolidate` engine parser listed [here](https://github.com/tj/consolidate.js#supported-template-engines).
-   `extension` (optional) **SHOULD** be provided where the file extension of the engine used is different from its name. e.g. a `swig` template would use `.html` as its file extension which is quite different from the engine name. Detailed example found [here](https://github.com/node-swig/swig-templates/tree/master/examples/basic)
-   `engineOptions` (optional) is a JavaScript object representation of the configuration options of engine used.

The `JuiceOptions` is exactly the same as required in the `juice` package specifications [here](https://github.com/Automattic/juice#options).

## Guide

After completing the configuration(s), you can go ahead and inject the `pdf` service into your class. The service provides three (3) methods (samples below) which can be used to either generate PDF:

-   to a file on the host machine;
-   as a stream (i.e. `Readable`); or
-   as a `Buffer`.

```ts
import { Injectable } from '@nestjs/common';
import { PDFService } from '@t00nday/nestjs-pdf';

@Injectable()
export class YourService {
    constructor(private readonly pdfService: PDFService);

    generatePDFToFile(
        template: string,
        filename?: string,
        options: PDFOptions,
    ) {
        this.pdf.toFile(template, filename, options); // returns Observable<FileInfo>;
    }

    generatePDFToStream(template: string, options?: PDFOptions) {
        this.pdf.toStream(template, options); // returns Observable<Readable>;
    }

    generatePDFToBuffer(template: string, options?: PDFOptions) {
        this.pdf.toBuffer(template, options); // returns Observable<Buffer>;
    }
}
```

## Changelog

### 2.0.6 / 2020-11-23

-   chore(): dependencies updates
-   docs(): installation guide update

### 2.0.5 / 2020-11-14

-   chore(): dependencies updates

### 2.0.4 / 2020-11-13

-   docs(): correction of documentation

### 2.0.0 / 2020-11-12

-   Removes `pdf()` as the default service provided by the module.
-   Provides an object of class `PDFService` as its default service.
-   Removes registeration of module by name.
-   PDFService provides three methods for either generating `toFile`, `toStream` or `toBuffer`.

## Contributing

Contributions are welcome. However, please read the contribution's [guide](./CONTRIBUTING.md).
