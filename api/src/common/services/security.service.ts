import { Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

// Todo Replace with your actual secret key
const jwtSecret = "your_secret_key";

@Injectable()
export class SecurityService {
  constructor() {}

  public hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  public verifyPassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  public generateJwtToken(
    payload: string | object,
    options?: SignOptions,
  ): string {
    return jwt.sign(payload, jwtSecret, options);
  }

  public decodeJwtToken(token: string) {
    const payload = jwt.verify(token, jwtSecret);

    return payload;
    // Todo
    // return assert<T>(payload);
  }
}
