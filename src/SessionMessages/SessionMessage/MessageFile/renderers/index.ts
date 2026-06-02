// Re-export the default-exported renderers as named exports so they are
// reachable from the package root (for docs/TSDoc and external consumers).
export { default as DefaultFileRenderer } from './DefaultFileRenderer';
export { default as CSVFileRenderer } from './CSVFileRenderer';
export { default as ImageFileRenderer } from './ImageFileRenderer';
export { default as PDFFileRenderer } from './PDFFileRenderer';
