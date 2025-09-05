declare module "html2canvas" {
  const html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  export default html2canvas;
}

declare module "jspdf" {
  export default class jsPDF {
    constructor(options?: any);
    internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
    addImage(
      imageData: string | HTMLImageElement | HTMLCanvasElement,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number,
      alias?: string,
      compression?: string
    ): void;
    addPage(format?: string | string[], orientation?: string): void;
    save(filename?: string): void;
  }
}
