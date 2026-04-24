import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchMovimientos } from "../../../api/reportesAPI";

const ITEMS_PER_PAGE = 5;

export function useMovimientos() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchMovimientos();
        if (!cancelled) setMovements(data || []);
      } catch (error) {
        console.error("Error loading movements:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, []);

  const filteredMovements = useMemo(() => {
    let filtered = movements;

    if (tipoFilter !== "Todos") {
      filtered = filtered.filter((m) => {
        const type = m.tipoMovimiento?.toLowerCase() || "";
        return type === tipoFilter.toLowerCase();
      });
    }

    if (startDate && endDate) {
      filtered = filtered.filter((m) => {
        if (!m.fechaRegistro) return false;
        const movDate = new Date(m.fechaRegistro);
        movDate.setHours(0, 0, 0, 0);

        const start = new Date(startDate + "T00:00:00");
        const end = new Date(endDate + "T00:00:00");

        return movDate >= start && movDate <= end;
      });
    }

    const term = searchTerm.toLowerCase();
    if (term) {
      filtered = filtered.filter((m) =>
        (m.idMovimiento?.toString().includes(term)) ||
        (m.productoNombre?.toLowerCase().includes(term)) ||
        (m.motivo?.toLowerCase().includes(term)) ||
        (m.usuarioNombre?.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [movements, searchTerm, tipoFilter, startDate, endDate]);

  const sortedMovements = useMemo(() =>
    [...filteredMovements].sort((a, b) => {
      const idA = a.idMovimiento ?? 0;
      const idB = b.idMovimiento ?? 0;
      return sortOrder === "asc" ? idA - idB : idB - idA;
    }),
    [filteredMovements, sortOrder]
  );

  const totalItems = sortedMovements.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = sortedMovements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleTipoChange = useCallback((value) => {
    setTipoFilter(value);
    setCurrentPage(1);
  }, []);

  const handleStartDateChange = useCallback((value) => {
    setStartDate(value);
    if (endDate && value > endDate && value !== "") {
      setEndDate(value);
    }
    setCurrentPage(1);
  }, [endDate]);

  const handleEndDateChange = useCallback((value) => {
    setEndDate(value);
    if (startDate && value < startDate && value !== "") {
      setStartDate(value);
    }
    setCurrentPage(1);
  }, [startDate]);

  const toggleSort = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  return {
    loading,
    searchTerm,
    tipoFilter,
    startDate,
    endDate,
    currentPage,
    sortOrder,
    totalItems,
    totalPages,
    startIndex,
    currentItems,
    sortedMovements,
    handleSearchChange,
    handleTipoChange,
    handleStartDateChange,
    handleEndDateChange,
    toggleSort,
    handlePrevPage,
    handleNextPage,
  };
}
