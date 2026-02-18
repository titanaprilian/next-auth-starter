"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const DEBOUNCE_DELAY = 500;

export function useUserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "all";
  const page = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, DEBOUNCE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [search]);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      return newSearchParams.toString();
    },
    [searchParams],
  );

  const setSearch = useCallback(
    (value: string) => {
      router.push(
        `?${createQueryString({ search: value, page: DEFAULT_PAGE })}`,
      );
    },
    [router, createQueryString],
  );

  const setRole = useCallback(
    (value: string) => {
      router.push(`?${createQueryString({ role: value, page: DEFAULT_PAGE })}`);
    },
    [router, createQueryString],
  );

  const setPage = useCallback(
    (value: number) => {
      router.push(`?${createQueryString({ page: value })}`);
    },
    [router, createQueryString],
  );

  const setLimit = useCallback(
    (value: number) => {
      router.push(
        `?${createQueryString({ limit: value, page: DEFAULT_PAGE })}`,
      );
    },
    [router, createQueryString],
  );

  const resetFilters = useCallback(() => {
    router.push("?");
  }, [router]);

  return {
    search,
    debouncedSearch,
    role,
    page,
    limit,
    setSearch,
    setRole,
    setPage,
    setLimit,
    resetFilters,
  };
}
