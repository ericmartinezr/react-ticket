import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import PdfPrinter from 'pdfmake';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fonts = {
  Roboto: {
    normal: path.join(__dirname, 'fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, 'fonts/Roboto-Bold.ttf'),
    italics: path.join(__dirname, 'fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, 'fonts/Roboto-BoldItalic.ttf'),
  },
};

const printer = new PdfPrinter(fonts);

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export async function generateTicketPdf(ticketData, outputFilePath) {
  const {
    eventName,
    location,
    price,
    eventImage,
    startTime,
    endTime,
    purchasedAt,
  } = ticketData;

  let eventImageBase64 = null;

  // Attempt to read and encode the event image
  if (eventImage) {
    try {
      const imagePath = path.resolve(eventImage);
      const imageData = await fs.readFile(imagePath);
      const imageExt = path.extname(imagePath).substring(1);
      eventImageBase64 = `data:image/${imageExt};base64,${imageData.toString(
        'base64'
      )}`;
    } catch (err) {
      console.warn(
        'Warning: Event image not found or could not be read. Proceeding without image.'
      );
    }
  }

  const docDefinition = {
    pageSize: 'A5',
    pageOrientation: 'landscape',
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header Section
      {
        text: eventName,
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      // Event Image
      ...(eventImageBase64
        ? [
            {
              image: eventImageBase64,
              width: 400,
              alignment: 'center',
              margin: [0, 0, 0, 20],
            },
          ]
        : []),
      // Event Details
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Location:', style: 'label' },
              { text: location, style: 'value' },
              { text: 'Start Time:', style: 'label', margin: [0, 10, 0, 0] },
              { text: formatDateTime(startTime), style: 'value' },
              { text: 'End Time:', style: 'label', margin: [0, 10, 0, 0] },
              { text: formatDateTime(endTime), style: 'value' },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'Price:', style: 'label' },
              { text: `$${price.toFixed(2)}`, style: 'value' },
              { text: 'Purchased At:', style: 'label', margin: [0, 10, 0, 0] },
              { text: formatDateTime(purchasedAt), style: 'value' },
            ],
          },
        ],
        columnGap: 20,
        margin: [0, 0, 0, 20],
      },
      // Footer
      {
        text: 'Thank you for your purchase!',
        style: 'footer',
        alignment: 'center',
        margin: [0, 20, 0, 0],
      },
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        color: '#1E3A8A',
      },
      label: {
        fontSize: 12,
        bold: true,
        color: '#1E3A8A',
      },
      value: {
        fontSize: 12,
        color: '#000000',
      },
      footer: {
        fontSize: 10,
        italics: true,
        color: '#10B981',
      },
    },
    defaultStyle: {
      font: 'Roboto',
    },
  };

  try {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const writeStream = await fs.open(outputFilePath, 'w');
    const stream = writeStream.createWriteStream();
    pdfDoc.pipe(stream);
    pdfDoc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        console.log(`PDF ticket saved to ${outputFilePath}`);
        resolve(outputFilePath);
      });

      stream.on('error', (err) => {
        console.error('Error writing PDF file:', err);
        reject(new Error('Failed to write PDF file.'));
      });
    });
  } catch (err) {
    console.error('Error generating PDF:', err);
    throw new Error('Failed to generate PDF.');
  }
}

export default generateTicketPdf;
