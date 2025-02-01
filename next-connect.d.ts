declare module 'next-connect' {
  import { NextApiRequest, NextApiResponse } from 'next';

  export interface NextConnect {
    <TReq extends NextApiRequest = NextApiRequest, TRes extends NextApiResponse = NextApiResponse>(
      req: TReq,
      res: TRes,
      next: () => void
    ): void;
  }

  const nextConnect: NextConnect;
  export default nextConnect;
}
