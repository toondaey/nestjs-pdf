export function getHtmlPdfOptionsToken(name?: string): string {
    return `PdfOptionsToken(${name ? name : 'default'})`;
}

export function getPdfToken(name?: string): string {
    return `PdfToken(${name ? name : 'default'})`;
}
