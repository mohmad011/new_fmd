import pdfMake from "pdfmake/build/pdfmake";
import vfs from "./fonts/vfs_fonts";
pdfMake.vfs = vfs;

import getDocDefinition from "./docDefinition";

pdfMake.fonts = {
  Cairo: {
    normal: "Cairo-Regular-400.ttf",
    bold: "Cairo-Black-900.ttf",
    italics: "Cairo-Regular-400.ttf",
    bolditalics: "Cairo-Black-900.ttf",
  },
};

function printDoc(printParams, gridApi, columnApi) {
  const docDefinition = getDocDefinition(printParams, gridApi, columnApi);
  pdfMake.createPdf(docDefinition).download();
}

export default printDoc;

