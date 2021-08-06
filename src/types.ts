declare global {
  interface Window {
    Omise: any;
  }
}

export type ScriptTypes = 'primary' | 'secondary';

export interface useOmiseArgs {
  publicKey: string;
  scriptType?: ScriptTypes;
}

export type CreateTokenAsTypes = 'card';

export type CreateHandler = (
  status: number,
  response: Record<string, any>
) => void;

export type CreateTokenFunction = (
  as: CreateTokenAsTypes,
  attributes: Record<string, unknown>,
  handler: CreateHandler
) => void;

export type CreateSourceFunction = (
  type: string,
  options: Record<string, unknown>,
  handler: CreateHandler
) => void;

export type CreateTokenPromiseFunction = (
  as: CreateTokenAsTypes,
  attributes: Record<string, any>
) => Promise<any>;

export interface useOmiseReturn {
  loading: boolean;
  loadingError: boolean;
  createToken: CreateTokenFunction | null;
  checkCreateTokenError: (
    status: number,
    response: Record<string, any>
  ) => string | null;
  createSource: CreateSourceFunction | null;
  createTokenPromise: CreateTokenPromiseFunction | null;
}
