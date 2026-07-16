export class ValidatorUtil {

  static isNullOrEmpty(value: string): boolean {

    return !value || value.trim() === '';

  }

}