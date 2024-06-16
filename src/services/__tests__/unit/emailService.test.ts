import nodemailer from 'nodemailer';
import EmailService, { IEmailService } from '../../emailService';

jest.mock('nodemailer');

const mockedCreateTransport = nodemailer.createTransport as jest.Mock;
const mockedSendMail = jest.fn();
mockedCreateTransport.mockReturnValue({ sendMail: mockedSendMail });

describe('EmailService', () => {
  const env = process.env;
  let service: IEmailService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    process.env.EMAIL = 'test@example.com';
    process.env.EMAIL_PASSWORD = 'password';
    process.env.EMAIL_SERVICE = 'gmail';
    service = new EmailService();
  });

  afterAll(() => {
    process.env = env;
  });

  it('should throw an error if EMAIL, EMAIL_PASSWORD or EMAIL_SERVICE is not defined', () => {
    delete process.env.EMAIL;
    delete process.env.EMAIL_PASSWORD;
    delete process.env.EMAIL_SERVICE;

    expect(() => new EmailService()).toThrow(
      'EMAIL, EMAIL_PASSWORD or EMAIL_SERVICE is not defined in environment variables',
    );
  });

  describe('sendEmail', () => {
    it('should send an email with the correct parameters', async () => {
      const email = 'recipient@example.com';
      const subject = 'Test Subject';
      const text = 'Test email content';

      await service.sendEmail(email, subject, text);

      expect(mockedSendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL,
        to: email,
        subject,
        text,
      });
    });

    it('should throw an error if sending the email fails', async () => {
      const email = 'recipient@example.com';
      const subject = 'Test Subject';
      const text = 'Test email content';

      mockedSendMail.mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(service.sendEmail(email, subject, text)).rejects.toThrow('Failed to send email');
    });

    it('should throw an error if the email address is invalid', async () => {
      const email = 'invalid-email';
      const subject = 'Test Subject';
      const text = 'Test email content';

      await expect(service.sendEmail(email, subject, text)).rejects.toThrow(
        'Invalid email address',
      );
    });

    it('should throw an error if the email text is empty', async () => {
      const email = 'recipient@example.com';
      const subject = 'Test Subject';
      const text = '';

      await expect(service.sendEmail(email, subject, text)).rejects.toThrow(
        'Email text cannot be empty',
      );
    });

    it('should handle large email content', async () => {
      const email = 'recipient@example.com';
      const subject = 'Test Subject';
      const text = 'A'.repeat(10000); // Large email content

      await service.sendEmail(email, subject, text);

      expect(mockedSendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL,
        to: email,
        subject,
        text,
      });
    });

    it('should handle unexpected errors', async () => {
      const email = 'recipient@example.com';
      const subject = 'Test Subject';
      const text = 'Some text';

      mockedSendMail.mockRejectedValueOnce(new Error('Some error occured'));

      await expect(service.sendEmail(email, subject, text)).rejects.toThrow('Failed to send email');
    });
  });
});
