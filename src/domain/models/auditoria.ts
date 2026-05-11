export type AuditoriaModel = {
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  path: string;
  method: string;
  requestBody: any;
  requestQuery: any;
  responseBody: any;
  statusCode: number;
  error?: string;
  createdAt: Date;
}
