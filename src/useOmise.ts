import { useState, useEffect } from 'react';
import { useOmiseScript } from './useOmiseScript';
import type {
  useOmiseArgs,
  useOmiseReturn,
  CreateTokenFunction,
  CreateSourceFunction,
  CreateTokenPromiseFunction,
  CreateSourcePromiseFunction,
} from './types';

export const checkCreateTokenError: useOmiseReturn['checkCreateTokenError'] = (
  status,
  response
) => {
  if (status === 200) return null;
  if (response.card && !response.card.security_code_check) {
    return 'Incorrect security code';
  }
  if (response.object === 'error') {
    return response.message;
  }
  return 'Unknown error';
};

export const useOmise = ({
  publicKey,
  scriptType,
}: useOmiseArgs): useOmiseReturn => {
  const [
    createTokenFn,
    setCreateTokenFn,
  ] = useState<CreateTokenFunction | null>(null);
  const [
    createSourceFn,
    setCreateSourceFn,
  ] = useState<CreateSourceFunction | null>(null);
  const [
    createTokenPromiseFn,
    setCreateTokenPromiseFn,
  ] = useState<CreateTokenPromiseFunction | null>(null);
  const [
    createSourcePromiseFn,
    setCreateSourcePromiseFn,
  ] = useState<CreateSourcePromiseFunction | null>(null);
  const [loadingScript, errorLoadingScript] = useOmiseScript(scriptType);

  useEffect(() => {
    if (window.Omise) {
      window.Omise.setPublicKey(publicKey);
    }
  }, [publicKey, loadingScript]);

  useEffect(() => {
    if (window.Omise) {
      const { Omise } = window;
      const omiseCreateToken: CreateTokenFunction = Omise.createToken.bind(
        Omise
      );
      const omiseCreateSource: CreateSourceFunction = Omise.createSource.bind(
        Omise
      );

      const createToken = () => omiseCreateToken;
      const createSource = () => omiseCreateSource;

      // Promisify the original createToken function.
      const createTokenPromise = (): CreateTokenPromiseFunction => {
        return (as, attributes) => {
          return new Promise((resolve, reject) => {
            omiseCreateToken(as, attributes, (status, response) => {
              const hasError = checkCreateTokenError(status, response);
              if (hasError) {
                reject(response);
              } else {
                resolve(response?.id);
              }
            });
          });
        };
      };

      // Promisify the original createSource function.
      const createSourcePromise = (): CreateSourcePromiseFunction => {
        return (type, attributes) => {
          return new Promise((resolve, reject) => {
            omiseCreateSource(type, attributes, (status, response) => {
              if (status !== 200) {
                reject(response);
              } else {
                resolve(response?.id);
              }
            });
          });
        };
      };

      setCreateTokenFn(createToken);
      setCreateSourceFn(createSource);
      setCreateTokenPromiseFn(createTokenPromise);
      setCreateSourcePromiseFn(createSourcePromise);
    }
  }, [loadingScript]);

  return {
    loading: loadingScript,
    loadingError: errorLoadingScript,
    createToken: createTokenFn,
    createTokenPromise: createTokenPromiseFn,
    createSourcePromise: createSourcePromiseFn,
    checkCreateTokenError,
    createSource: createSourceFn,
  };
};
