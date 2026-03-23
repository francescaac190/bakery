import { useEffect, useMemo, useState } from 'react';
import type { Product } from './types';
import { fetchProducts } from './api';

type State =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: Product[]; error: null }
  | { status: 'error'; data: null; error: string };

export function useProducts() {
  const [state, setState] = useState<State>({
    status: 'idle',
    data: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ status: 'loading', data: null, error: null });

    fetchProducts(controller.signal)
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((e) => {
        // Abort is not a real error
        if (e?.name === 'AbortError') return;

        const message =
          typeof e?.message === 'string' ? e.message : 'Failed to load products';
        setState({ status: 'error', data: null, error: message });
      });

    return () => controller.abort();
  }, []);

  const helpers = useMemo(() => {
    return {
      isLoading: state.status === 'loading',
      isError: state.status === 'error',
      isSuccess: state.status === 'success',
    };
  }, [state.status]);

  return { ...state, ...helpers };
}