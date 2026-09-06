import { act, fireEvent, render, screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { describe, expect, it, type Mock, vi } from "vitest";
import SearchInput from "@/components/search-input";

describe("SearchInput", () => {
  it("pushes the search query after a debounce", () => {
    vi.useFakeTimers();
    const router = useRouter();
    const push = router.push as unknown as Mock;
    vi.mocked(usePathname).mockReturnValue("/search");
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
