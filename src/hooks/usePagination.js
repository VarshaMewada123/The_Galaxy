import { useState } from "react";

export default function usePagination(initialPage = 1, limit = 10) {
  const [page, setPage] = useState(initialPage);

  const next = () => setPage((prev) => prev + 1);
  const prev = () => setPage((prev) => Math.max(prev - 1, 1));
  const goTo = (pageNumber) => setPage(pageNumber);

  return {
    page,
    limit,
    next,
    prev,
    goTo,
  };
}
