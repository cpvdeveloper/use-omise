import { renderHook, act } from '@testing-library/react-hooks';
import { useOmiseScript, OMISE_SCRIPTS } from '../useOmiseScript';

describe('useScript', () => {
  beforeEach(() => {
    const html = document.querySelector('html');
    if (html) {
      html.innerHTML = '';
    }
  });

  it('should append a the primary script by default', () => {
    expect(document.querySelectorAll('script').length).toBe(0);

    const { result } = renderHook(() => useOmiseScript());

    const [loading, error] = result.current;

    expect(loading).toBe(true);
    expect(error).toBe(false);

    const script = document.querySelector('script');
    expect(script).not.toBeNull();
    if (script) {
      expect(script.getAttribute('src')).toEqual(OMISE_SCRIPTS.primary);
    }
  });

  it('can load the secondary script', () => {
    expect(document.querySelectorAll('script').length).toBe(0);

    const { result } = renderHook(() => useOmiseScript('secondary'));

    const [loading, error] = result.current;

    expect(loading).toBe(true);
    expect(error).toBe(false);

    const script = document.querySelector('script');
    expect(script).not.toBeNull();
    if (script) {
      expect(script.getAttribute('src')).toEqual(OMISE_SCRIPTS.secondary);
    }
  });

  it('should set loading to false once the script is loaded', async () => {
    expect(document.querySelectorAll('script').length).toBe(0);

    const { result } = renderHook(() => useOmiseScript());
    expect(document.querySelectorAll('script').length).toBe(1);

    const [loading, error] = result.current;
    expect(loading).toBe(true);
    expect(error).toBe(false);

    act(() => {
      const el = document.querySelector('script');
      if (el) {
        el.dispatchEvent(new Event('load'));
      }
    });

    const [loadingAfter, errorAfter] = result.current;
    expect(loadingAfter).toBe(false);
    expect(errorAfter).toBe(false);
  });

  it('should not reload the script if already loaded', () => {
    expect(document.querySelectorAll('script').length).toBe(0);

    const previousScript = document.createElement('script');
    previousScript.src = OMISE_SCRIPTS.primary;
    document.body.appendChild(previousScript);

    expect(document.querySelectorAll('script').length).toBe(1);

    const { rerender } = renderHook(() => useOmiseScript());
    expect(document.querySelectorAll('script').length).toBe(1);

    rerender();
    expect(document.querySelectorAll('script').length).toBe(1);
  });
});
