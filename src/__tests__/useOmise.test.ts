import { renderHook } from '@testing-library/react-hooks';
import { OMISE_SCRIPTS } from '../useOmiseScript';
import { useOmise, checkCreateTokenError } from '../useOmise';

describe('the checkCreateTokenError helper function', () => {
  it('returns null if there is no error', () => {
    const TEST_SUCCESS_STATUS = 200;
    const successResponse = {
      object: 'token',
    };
    expect(checkCreateTokenError(TEST_SUCCESS_STATUS, successResponse)).toBe(
      null
    );
  });

  it('returns the error message from the response', () => {
    const TEST_ERROR_STATUS = 400;
    const TEST_ERROR_MESSAGE = 'test error';
    const errorResponse = {
      object: 'error',
      message: TEST_ERROR_MESSAGE,
    };
    expect(checkCreateTokenError(TEST_ERROR_STATUS, errorResponse)).toBe(
      TEST_ERROR_MESSAGE
    );
  });

  it('returns the security code error message', () => {
    const TEST_ERROR_STATUS = 400;
    const securityCodeErrorResponse = {
      object: 'error',
      card: {
        security_code_check: false,
      },
    };
    expect(
      checkCreateTokenError(TEST_ERROR_STATUS, securityCodeErrorResponse)
    ).toBe('Incorrect security code');
  });
});

describe('the useOmise hook', () => {
  const TEST_PUBLIC_KEY = 'test-omise-key';
  const setPublicKeyMock = jest.fn();
  const createTokenMock = jest.fn();
  const createSourceMock = jest.fn();
  const createTokenPromiseMock = jest.fn();
  const createSourcePromiseMock = jest.fn();

  beforeEach(() => {
    const html = document.querySelector('html');
    if (html) {
      html.innerHTML = '';
    }

    window.Omise = {
      createToken: createTokenMock,
      createSource: createSourceMock,
      createTokenPromise: createTokenPromiseMock,
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

    expect(checkCreateTokenError(200, successResponse)).toBe(null);
    expect(checkCreateTokenError(400, errorResponse)).toBe(TEST_ERROR_MESSAGE);
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
  });

  it('returns the Omise create source function', () => {
    const { result } = renderHook(() =>
      useOmise({ publicKey: TEST_PUBLIC_KEY })
    );

    expect(typeof result.current.createSource).toBe('function');

    expect(createSourceMock).toHaveBeenCalledTimes(0);
    result.current.createSource?.('internet_banking_scb', {}, () => {});
    expect(createSourceMock).toHaveBeenCalledTimes(1);
  });

  it('returns a promisified version of the Omise create token function', () => {
    const { result } = renderHook(() =>
      useOmise({ publicKey: TEST_PUBLIC_KEY })
    );

    expect(typeof result.current.createTokenPromise).toBe('function');

    expect(createTokenPromiseMock).toHaveBeenCalledTimes(0);
    result.current.createTokenPromise?.('card', {}).then(() => {
      expect(createTokenPromiseMock).toHaveBeenCalledTimes(1);
    });
  });

  it('returns a promisified version of the Omise create source function', () => {
    const { result } = renderHook(() =>
      useOmise({ publicKey: TEST_PUBLIC_KEY })
    );

    expect(typeof result.current.createSourcePromise).toBe('function');

    expect(createSourcePromiseMock).toHaveBeenCalledTimes(0);
    result.current
      .createSourcePromise?.('internet_banking_bbl', {})
      .then(() => {
        expect(createSourcePromiseMock).toHaveBeenCalledTimes(1);
      });
  });
});
