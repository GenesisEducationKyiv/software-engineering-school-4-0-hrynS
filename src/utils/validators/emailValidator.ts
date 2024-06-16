export interface IEmailValidator {
  validateEmail(email: string): boolean;
}

class EmailValidator implements IEmailValidator {
  private emailRegex: RegExp;

  constructor() {
    this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  }

  public validateEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }
}

export default EmailValidator;
