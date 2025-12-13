import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest";
import SearchInput from "@/components/SearchInput";
import { useRouter } from "next/navigation";

describe("SearchInput", () => {
  it("pushes the search query after a debounce", () => {
    vi.useFakeTimers();
    const router = useRouter();
    const push = router.push as unknown as Mock;
    push.mockClear();

    render(<SearchInput />);

    const input = screen.getByPlaceholderText("Search for music");
    fireEvent.change(input, { target: { value: "jam" } });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(push).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/search?title=jam");

    vi.useRealTimers();
  });
});
