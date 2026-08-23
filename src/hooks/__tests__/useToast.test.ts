import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/useToast';
import { useToastStore } from '@/stores/toastStore';

describe('useToast', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useRealTimers();
  });

  it('adds a success toast with the correct variant and title', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Task created', 'Everything went fine.');
    });

    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0]).toMatchObject({
      variant: 'success',
      title: 'Task created',
      description: 'Everything went fine.',
    });
  });

  it('adds an error toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.error('Something failed');
    });

    expect(useToastStore.getState().toasts[0]).toMatchObject({ variant: 'error', title: 'Something failed' });
  });

  it('supports multiple simultaneous toasts, each with a unique id', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.info('First');
      result.current.warning('Second');
    });

    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(2);
    expect(toasts[0].id).not.toBe(toasts[1].id);
  });

  it('dismiss removes a toast by id', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('To be dismissed');
    });
    const id = useToastStore.getState().toasts[0].id;

    act(() => {
      result.current.dismiss(id);
    });

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('auto-dismisses a toast after the timeout', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.success('Will expire');
    });
    expect(useToastStore.getState().toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(useToastStore.getState().toasts).toHaveLength(0);
    vi.useRealTimers();
  });
});
