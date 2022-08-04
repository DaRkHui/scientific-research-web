export interface PaginationProps {
  page?: number;
  total?: number;
  rows?: number;
  pageSizes?: number[];
  itemCount?: number;
  showSizePicker?: boolean;
  showQuickJumper?: boolean;
}
