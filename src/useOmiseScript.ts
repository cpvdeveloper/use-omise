import { useEffect, useState } from 'react';
import type { ScriptTypes } from './types';

export const OMISE_SCRIPTS: {
  [key in ScriptTypes]: string;
} = {
  primary: 'https://cdn.omise.co/omise.js.gz',
  secondary: 'https://cdn2.omise.co/omise.js.gz',
};

const isBrowser = typeof window !== 'undefined';

const hasExistingScript = (src: string): boolean => {
  const existingScript: NodeListOf<Element> = document.querySelectorAll(
    `script[src="${src}"]`
  );
  return existingScript.length > 0;
};

export const useOmiseScript = (
  scriptType: ScriptTypes = 'primary'
): boolean[] => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const scriptSrc: string = OMISE_SCRIPTS[scriptType];

  useEffect(() => {
    const hasExisting = hasExistingScript(scriptSrc);
    if (!isBrowser || hasExisting) {
      return;
    }

    setLoading(true);

    const scriptElement: HTMLScriptElement = document.createElement('script');
    scriptElement.setAttribute('src', scriptSrc);
    scriptElement.setAttribute('type', 'text/javascript');

    const handleLoad = () => setLoading(false);
    const handleError = () => {
      setLoading(false);
      setError(true);
      scriptElement.remove();
    };

    scriptElement.addEventListener('load', handleLoad);
    scriptElement.addEventListener('error', handleError);

    document.body.appendChild(scriptElement);

    return () => {
      scriptElement.removeEventListener('load', handleLoad);
      scriptElement.removeEventListener('error', handleError);
    };
  }, []);

  return [loading, error];
};
