import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

type Props = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
};

export function PaginationBtn({ page, totalPages, setPage }: Props) {
  return (
    <Pagination>
      <PaginationContent>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(page - 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {[...Array(totalPages || 1)].map((_, i) => (
          <PaginationItem key={i}>
            <button
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-black text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(page + 1)}
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}