import path from 'path';
import amqp from 'amqplib';
import './utils/generateTicket.js';
import generateTicketPdf from './utils/generateTicket.js';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

amqp
  .connect(`${process.env.RABBITMQ_SERVICE_URL}`)
  .then((connection) => connection.createChannel())
  .then((channel) => {
    const queueName = 'generate_ticket';

    channel.assertQueue(queueName, {
      durable: true,
    });

    console.log(
      ' [*] Waiting for messages in %s. To exit press CTRL+C',
      queueName
    );

    channel.consume(
      queueName,
      async (msg) => {
        const content = msg.content.toString();
        console.log(' [x] Received %s', content);

        // Helper to get __dirname in ES modules
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const outputFilePath = path.join(
          __dirname,
          'tickets',
          `ticket_${uuidv4()}.pdf`
        );

        try {
          const filePath = await generateTicketPdf(
            JSON.parse(content),
            outputFilePath
          );
          console.log(`PDF successfully created at: ${filePath}`);
        } catch (error) {
          console.error('Failed to generate PDF:', error);
        }
      },
      {
        noAck: true,
      }
    );
  })
  .catch((error) => {
    console.error('AMQP error ', error);
  });
