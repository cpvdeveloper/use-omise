import { renderHook } from '@testing-library/react-hooks';
import { OMISE_SCRIPTS } from '../useOmiseScript';
import { useOmise, checkCreateTokenError } from '../useOmise';

describe('the checkCreateTokenError helper function', () => {
  it('returns null if there is no error', () => {
    const successResponse = {
      object: 'token',
    };
    expect(checkCreateTokenError(successResponse)).toBe(null);
  });

  it('returns the error message from the response', () => {
    const TEST_ERROR_MESSAGE = 'test error';
    const errorResponse = {
      object: 'error',
      message: TEST_ERROR_MESSAGE,
    };
    expect(checkCreateTokenError(errorResponse)).toBe(TEST_ERROR_MESSAGE);
  });

  it('returns the security code error message', () => {
    const securityCodeErrorResponse = {
      object: 'error',
      card: {
        security_code_check: false,
      },
    };
    expect(checkCreateTokenError(securityCodeErrorResponse)).toBe(
      'Incorrect security code'
    );
  });
});

describe('the useOmise hook', () => {
  const TEST_PUBLIC_KEY = 'test-omise-key';
  const setPublicKeyMock = jest.fn();
  const createTokenMock = jest.fn();
  const createSourceMock = jest.fn();

  beforeEach(() => {
    const html = document.querySelector('html');
    if (html) {
      html.innerHTML = '';
    }

    window.Omise = {
      createToken: createTokenMock,
      createSource: createSourceMock,
      setPublicKey: setPublicKeyMock,
    };
  });

  it('loads the Omise script', () => {
    expect(document.querySelectorAll('script').length).toBe(0);

    const { result } = renderHook(() =>
      useOmise({ publicKey: TEST_PUBLIC_KEY })
    );

    const { loading, loadingError } = result.current;

    expect(loading).toBe(true);
    expect(loadingError).toBe(false);

    const script = document.querySelector('script');
    expect(script).not.toBeNull();
    if (script) {
      expect(script.getAttribute('src')).toEqual(OMISE_SCRIPTS.primary);
    }
  });

  it('can load the secondary script', () => {
    expect(document.querySelectorAll('script').length).toBe(0);

    const { result } = renderHook(() =>
      useOmise({ publicKey: TEST_PUBLIC_KEY, scriptType: 'secondary' })
    );

    const { loading, loadingError } = result.current;

    expect(loading).toBe(true);
    expect(loadingError).toBe(false);

    const script = document.querySelector('script');
    expect(script).not.toBeNull();
    if (script) {
      expect(script.getAttribute('src')).toEqual(OMISE_SCRIPTS.secondary);
    }
  });

  it('returns the checkCreateTokenError function', () => {
    const { result } = renderHook(() =>
      useOmise({ publicKey: TEST_PUBLIC_KEY })
    );

    const { checkCreateTokenError } = result.current;

    expect(checkCreateTokenError).toBeInstanceOf(Function);

    const successResponse = {
      object: 'token',
    };

    const TEST_ERROR_MESSAGE = 'test error';
    const errorResponse = {
      object: 'error',
      message: TEST_ERROR_MESSAGE,
    };

    expect(checkCreateTokenError(successResponse)).toBe(null);
    expect(checkCreateTokenError(errorResponse)).toBe(TEST_ERROR_MESSAGE);
  });

  it('sets the Omise public key', () => {
    renderHook(() => useOmise({ publicKey: TEST_PUBLIC_KEY }));
    expect(setPublicKeyMock).toHaveBeenCalledWith(TEST_PUBLIC_KEY);
  });

  it('returns the Omise create token function', () => {
    const { result } = renderHook(() =>
      useOmise({ publicKey: TEST_PUBLIC_KEY })
    );

    expect(typeof result.current.createToken).toBe('function');

    expect(createTokenMock).toHaveBeenCalledTimes(0);
    result.current.createToken?.('card', {}, () => {});
    expect(createTokenMock).toHaveBeenCalledTimes(1);
    expect(createTokenMock).toHaveBeenCalledTimes(1);
  });

  it('returns the Omise create source function', () => {
    const { result } = renderHook(() =>
      useOmise({ publicKey: TEST_PUBLIC_KEY })
    );

    expect(typeof result.current.createSource).toBe('function');

    expect(createSourceMock).toHaveBeenCalledTimes(0);
    result.current.createSource?.('internet_banking_scb', {}, () => {});
    expect(createSourceMock).toHaveBeenCalledTimes(1);
    expect(createSourceMock).toHaveBeenCalledTimes(1);
  });
});
