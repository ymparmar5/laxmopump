import { useEffect, useState } from "react";

const PdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    fetch("your-secure-pdf-url.pdf")
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      });
  }, []);

  return <iframe src={pdfUrl} width="100%" height="600px"></iframe>;
};

export default PdfViewer;
