"use client";

import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface TablePaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  showingText: string;
  rowsText: string;
}

const getPageNumbers = (
  currentPage: number,
  totalPages: number
): (number | "...")[] => {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
  }

  return pages;
};

/**
 * Reusable table pagination component.
 *
 * @example
 * <TablePagination
 *   page={page}
 *   limit={limit}
 *   total={total}
 *   onPageChange={setPage}
 *   onLimitChange={setLimit}
 *   showingText="Showing {start} to {end} of {total} entries"
 *   rowsText="Rows"
 * />
 */
export function TablePagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  showingText,
  rowsText,
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / limit);
  const pageNumbers = getPageNumbers(page, totalPages);

  // Format showing text with values
  const formattedShowingText = showingText
    .replace("{start}", String((page - 1) * limit + 1))
    .replace("{end}", String(Math.min(page * limit, total)))
    .replace("{total}", String(total));

  return (
    <div className="flex items-center justify-between border-t px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {formattedShowingText}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={page <= 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((p, idx) =>
            p === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1 text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant={page === p ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            )
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-muted-foreground">{rowsText}:</span>
          <Select
            value={String(limit)}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
