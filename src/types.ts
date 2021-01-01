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

export type CreateTokenHandler = (
  status: number,
  response: Record<string, any>
) => void;

export type CreateTokenFunction = (
  as: CreateTokenAsTypes,
  attributes: Record<string, any>,
  handler: CreateTokenHandler
) => void;

export interface useOmiseReturn {
  loading: boolean;
  loadingError: boolean;
  createToken: CreateTokenFunction | null;
  checkCreateTokenError: (response: Record<string, any>) => string | null;
}
