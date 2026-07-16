export class JwtUtil {

  static decode(token: string): any {

    if (!token) return null;

    const payload = token.split('.')[1];

    return JSON.parse(atob(payload));

  }

}