import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import useDebounce from "@/hooks/useDebounce";

describe("useDebounce", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 200));
    expect(result.current).toBe("hello");
  });

  it("updates the value after the default delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: "first" },
      }
    );

    rerender({ value: "second" });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe("second");
  });

  it("honors a custom delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "first", delay: 1000 },
      }
    );

    rerender({ value: "updated", delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });
});
