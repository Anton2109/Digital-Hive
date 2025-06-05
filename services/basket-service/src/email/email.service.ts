import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly senderEmail = 'tony.polischuck2016@gmail.com';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.senderEmail,
        pass: 'hgbn gvtc bfvw njuo',
      },
    });
  }

  async sendGameKeys(email: string, gameKeys: { gameName: string; key: string }[]): Promise<void> {
    try {
      const gameKeysList = gameKeys
        .map(({ gameName, key }) => `${gameName}: ${key}`)
        .join('\n');

      const mailOptions = {
        from: this.senderEmail,
        to: email,
        subject: 'Ваши ключи к играм',
        text: `Спасибо за покупку! Вот ваши ключи к играм:\n\n${gameKeysList}\n\nС уважением,\nКоманда Digital Hive`,
        html: `
          <h2>Спасибо за покупку!</h2>
          <p>Вот ваши ключи к играм:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${gameKeys.map(({ gameName, key }) => `
              <p><strong>${gameName}:</strong><br>
              <code style="background-color: #e0e0e0; padding: 5px; border-radius: 3px;">${key}</code></p>
            `).join('')}
          </div>
          <p>С уважением,<br>Команда Digital Hive</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
} 