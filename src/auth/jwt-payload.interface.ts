export interface Payload {
  sub: string;
  email: string;
  iat?: number; // "Issued At" (auto JWT)
  exp?: number; // "Expiration" (auto JWT)
}
