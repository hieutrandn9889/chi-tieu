// pdfmake 0.3 ships no type declarations; only the browser entry points used
// by src/lib/report-pdf.ts are declared here.
declare module "pdfmake/build/pdfmake" {
  const pdfMake: {
    addFontContainer(container: unknown): void;
    setUrlAccessPolicy(callback: (url: string) => boolean): void;
    createPdf(definition: unknown): {
      download(fileName?: string): Promise<void>;
    };
  };
  export default pdfMake;
}

declare module "pdfmake/build/fonts/Roboto" {
  const fontContainer: unknown;
  export default fontContainer;
}
