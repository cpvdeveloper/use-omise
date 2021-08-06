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
type TokenParams = Record<string, string | number>;

export type CreateHandler = (
  status: number,
  response: Record<string, string>
) => void;

export type CreateTokenFunction = (
  type: CreateTokenAsTypes,
  tokenParams: TokenParams,
  handler: CreateHandler
) => void;

export type CreateSourceFunction = (
  type: string,
  sourceParams: Record<string, unknown>,
  handler: CreateHandler
) => void;

export type CreateTokenPromiseFunction = (
  type: CreateTokenAsTypes,
  tokenParams: TokenParams
) => Promise<string | Record<string, string>>;

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
