import nodemailer from 'nodemailer';

class EmailService {
  private transporter;

  constructor() {
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_SERVICE) {
      throw new Error(
        'EMAIL, EMAIL_PASSWORD or EMAIL_SERVICE is not defined in environment variables',
      );
    }

    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public async sendEmail(email: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject,
      text,
    });
  }
}

export default new EmailService();
