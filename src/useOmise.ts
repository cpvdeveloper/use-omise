import { useState, useEffect } from 'react';
import { useOmiseScript } from './useOmiseScript';
import type {
  useOmiseArgs,
  useOmiseReturn,
  CreateTokenFunction,
} from './types';

export const checkCreateTokenError: useOmiseReturn['checkCreateTokenError'] = (
  response
) => {
  if (response.card && !response.card.security_code_check) {
    return 'Incorrect security code';
  }
  if (response.object === 'error') {
    return response.message;
  }
  return null;
};

export const useOmise = ({
  publicKey,
  scriptType,
}: useOmiseArgs): useOmiseReturn => {
  const [
    createTokenFn,
    setCreateTokenFn,
  ] = useState<CreateTokenFunction | null>(null);
  const [loadingScript, errorLoadingScript] = useOmiseScript(scriptType);

  useEffect(() => {
    if (window.Omise) {
      window.Omise.setPublicKey(publicKey);
    }
  }, [publicKey, loadingScript]);

  useEffect(() => {
    if (window.Omise) {
      const createToken = () => {
        const { Omise } = window;
        return Omise.createToken.bind(Omise);
      };
      setCreateTokenFn(createToken);
    }
  }, [loadingScript]);

  return {
    loading: loadingScript,
    loadingError: errorLoadingScript,
    createToken: createTokenFn,
    checkCreateTokenError,
  };
};