export class ValidationHelper {

  static isEmail(email: string): boolean {

    return /\S+@\S+\.\S+/.test(email);

  }

}