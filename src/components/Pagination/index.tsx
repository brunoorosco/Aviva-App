import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationProps {
  items: number         // Total de itens
  pageSize: number      // Quantidade por página
  currentPage: number   // Página atual
  onPageChange: (page: number) => void
}

const range = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

const getPageNumbers = (totalPages: number, currentPage: number): (number | "...")[] => {
  const visiblePages = 3
  const siblings = 1
  const firstPage = 1
  const lastPage = totalPages

  const startPages = range(1, Math.min(visiblePages, totalPages))
  const endPages = range(Math.max(totalPages - visiblePages + 1, visiblePages + 1), totalPages)

  const shouldShowLeftDots = currentPage > visiblePages + siblings
  const shouldShowRightDots = currentPage < totalPages - visiblePages - siblings + 1

  const middlePages = range(
    Math.max(currentPage - siblings, visiblePages + 1),
    Math.min(currentPage + siblings, totalPages - visiblePages)
  )

  const pages: (number | "...")[] = []

  // Start
  pages.push(...startPages)

  // Dots before middle
  if (shouldShowLeftDots) {
    if (startPages[startPages.length - 1] + 1 < middlePages[0]) {
      pages.push("...")
    }
  }

  // Middle
  if (shouldShowLeftDots || shouldShowRightDots) {
    pages.push(...middlePages)
  }

  // Dots after middle
  if (shouldShowRightDots) {
    if (middlePages[middlePages.length - 1] + 1 < endPages[0]) {
      pages.push("...")
    }
  }

  // End
  pages.push(...endPages)

  return pages
}

const ShadcnPagination = ({
  items,
  pageSize,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(items / pageSize)
  if (totalPages <= 1) return null

  const pages = getPageNumbers(totalPages, currentPage)

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {/* Botão anterior */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Primeira página */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(1)}
            className={`w-8 h-8 text-sm rounded-md border transition-colors ${
              currentPage === 1 ? "bg-primary text-white" : "hover:bg-muted text-foreground"
            }`}
          >
            &laquo;
          </button>
        </PaginationItem>

        {/* Números de página com "..." */}
        {pages.map((page, index) =>
          page === "..." ? (
            <PaginationItem key={index}>
              <span className="px-2 text-muted-foreground">...</span>
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 text-sm rounded-md border transition-colors ${
                  page === currentPage ? "bg-primary text-white" : "hover:bg-muted text-foreground"
                }`}
              >
                {page}
              </button>
            </PaginationItem>
          )
        )}

        {/* Última página */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(totalPages)}
            className={`w-8 h-8 text-sm rounded-md border transition-colors ${
              currentPage === totalPages ? "bg-primary text-white" : "hover:bg-muted text-foreground"
            }`}
          >
            &raquo;
          </button>
        </PaginationItem>

        {/* Botão próximo */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default ShadcnPagination
