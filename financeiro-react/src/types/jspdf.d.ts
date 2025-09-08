declare module 'jspdf' {
  export default class jsPDF {
    constructor(options?: any);
    setFontSize(size: number): void;
    text(text: string, x: number, y: number, options?: any): void;
    save(filename: string): void;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

declare module 'jspdf-autotable' {
  const autoTable: (doc: any, options: any) => void;
  export default autoTable;
}
