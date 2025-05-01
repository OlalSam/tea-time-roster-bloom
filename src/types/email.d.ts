
declare module 'nodemailer' {
  export function createTransport(options: any): any;
  export const getTestMessageUrl: (info: any) => string;
}
