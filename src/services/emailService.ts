import nodemailer from 'nodemailer';
import { EmailValidator, IEmailValidator } from '../utils/validators';
import createError from 'http-errors';

export interface IEmailService {
  sendEmail(email: string, subject: string, text: string): Promise<void>;
}

class EmailService {
  private transporter;
  private emailValidator: IEmailValidator;

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

    this.emailValidator = new EmailValidator();
  }

  public async sendEmail(email: string, subject: string, text: string): Promise<void> {
    try {
      if (!email || !this.emailValidator.validateEmail(email)) {
        throw createError(400, 'Invalid email address');
      }

      if (!text) {
        throw createError(400, 'Email text cannot be empty');
      }
      await this.transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject,
        text,
      });
    } catch (error) {
      if (createError.isHttpError(error)) {
        throw error;
      }

      console.error('Failed to send email: ', error);
      throw createError(500, 'Failed to send email');
    }
  }
}

export default EmailService;
