import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableFooter
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type T_TableData = {
  dataList: any[];
  labels?: string[];
  alignments?: Record<number, "left" | "center" | "right">;
  pagination?: {
    rowsPerPage: "10" | "25" | "50" | "100";
    page: number;
    totalData: number;
    totalPages: number;
  };
  setPagination?: React.Dispatch<React.SetStateAction<T_TableData["pagination"]>>
  numbering?: boolean;
  capitalizeLabel?: boolean;
  isLoading?: boolean;
}

const TableData: React.FC<T_TableData> = ({
  dataList,
  labels,
  alignments,
  pagination,
  setPagination,
  numbering = true,
  capitalizeLabel = true,
  isLoading
}) => {
  const dataRender: T_TableData["dataList"] = numbering
  ? dataList?.map((data, idx) => ({
      no: <span className="w-full text-center">{((pagination?.page?? 1) - 1) * Number(pagination?.rowsPerPage?? 10) + (idx + 1)}</span>,
      ...data,
    }))
  : dataList;
  
  // const pageRange = useMemo(() => {
  //   if (pagination && pagination?.totalPages >= 4) {
  //     return Array.from({ length: 3 }, (_, i) => (
  //       <PaginationItem key={i}>
  //         <PaginationLink href="#" isActive={i + 1 === pagination?.page}>
  //           {i + 1}
  //         </PaginationLink>
  //       </PaginationItem>
  //     ))
  //   }
  // }, [pagination?.totalPages]);
  
  if (dataRender?.length === 0 && !isLoading) return (
    <p className="w-full my-10 text-center text-xl text-text-muted font-semibold">
      No Table Data
    </p>
  );
  
  if (dataRender?.length === 0 && isLoading) return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: labels?.length ?? 5 }).map((_, idx) => (
            <TableHead key={`table-data-head-${idx}`}>
              <div className="skeleton w-full h-6! rounded-full" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {Array.from({ length: 5 }).map((_, idx) => (
          <TableRow key={`table-data-body-${idx}`}>
            {Array.from({ length: labels?.length ?? 5 }).map((_, idx) => (
              <TableCell key={`table-data-body-col-${idx}`}>
                <div className="skeleton w-full h-6! rounded-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  
  // console.log({pagination});
  
  return (
    <div className="flex flex-col max-w-full gap-4">
      {dataRender?.length > 0
      ? <Table className="relative">
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader className="relative">
            <TableRow className="border-border">
              {Object.keys(dataRender[0])?.map((item, idx) => (
                <TableHead
                  key={`table-data-head-${item}-${idx}`}
                  className={cn(
                    "text-text-muted font-semibold",
                    capitalizeLabel && "uppercase",
                    alignments && alignments.hasOwnProperty(idx) && {
                      "text-start": alignments[idx] === "left",
                      "text-center": alignments[idx] === "center",
                      "text-end": alignments[idx] === "right",
                    }
                  )}
                >
                  {labels?.length
                  ? labels[idx]
                  // : item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                  : item.charAt(0).toUpperCase() + item.slice(1).replace("_", " ").trim()}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {dataRender?.map((data, idx) => (
              <TableRow key={`table-data-body-${idx}`} className="border-border/50">
                {Object.values(data)?.map((item: any, idx) => (
                  <TableCell
                    key={`table-data-body-col-${idx}-data-${item}`}
                    className={cn(
                      alignments && alignments.hasOwnProperty(idx) && {
                        "text-start": alignments[idx] === "left",
                        "text-center": alignments[idx] === "center",
                        "text-end": alignments[idx] === "right",
                      }
                    )}
                  >
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
          {isLoading
          ? <div className="absolute grid inset-0 w-full h-full backdrop-blur-sm place-items-center">
              <p className="text-lg font-semibold text-text-muted">Loading...</p>
            </div>
          : null}
        </Table>
      : <div className="w-full h-[500px] bg-dark-50 rounded-xl animate-pulse" />}

      {(pagination && setPagination)
      ? <div className="flex pt-2 border-t items-center justify-between">
          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
            <Select
              value={pagination?.rowsPerPage?.toString()?? "25"}
              onValueChange={(v) => setPagination((prev) => ({
                ...(prev?? pagination),
                rowsPerPage: v as "10" | "25" | "50" | "100",
                page: 1
              }))}
            >
              <SelectTrigger className="w-20" id="select-rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className="text-xs text-gray-500">Showing {((pagination?.page - 1) * Number(pagination?.rowsPerPage)) + 1} to {(pagination?.page * Number(pagination?.rowsPerPage)) > pagination?.totalData ? pagination?.totalData : pagination?.page * Number(pagination?.rowsPerPage)} of {pagination?.totalData}</span>
          </Field>

          <Pagination className="mx-0 w-fit">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text="Prev"
                  onClick={() => setPagination((prev) => ({...(prev?? pagination), page: pagination?.page - 1}))}
                  disabled={pagination?.page <= 1}
                />
              </PaginationItem>
              <>
                {Array.from({ length: pagination.totalPages < 3 ? pagination.totalPages : 3 }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={pagination.totalPages < 3
                        ? pagination?.page === i + 1
                        : pagination?.page === pagination?.totalPages
                          ? pagination?.page === (pagination?.page - 3) + (i + 1)
                          : pagination?.page <= 2
                            ? pagination?.page === i + 1
                            : pagination?.page === (i + 1) + (pagination?.page - 2)}
                      onClick={() => setPagination((prev) => ({
                        ...(prev?? pagination),
                        page: pagination.totalPages < 3
                        ? i + 1
                        :pagination?.page === pagination?.totalPages
                          ? (pagination?.page - 3) + (i + 1)
                          : pagination?.page <= 2
                            ? i + 1
                            : (i + 1) + (pagination?.page - 2)}))}
                      >
                      {pagination.totalPages < 3
                      ? i + 1
                      :pagination?.page === pagination?.totalPages
                        ? (pagination?.page - 3) + (i + 1)
                        : pagination?.page <= 2
                          ? i + 1
                          : (i + 1) + (pagination?.page - 2)}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {pagination?.totalPages >= 4 && pagination?.page <= pagination?.totalPages - 2
                ? <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                : null}
              </>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPagination((prev) => ({...(prev?? pagination), page: pagination?.page + 1}))}
                  disabled={pagination?.page >= pagination?.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      : null}
    </div>
  );
}

export default TableData;