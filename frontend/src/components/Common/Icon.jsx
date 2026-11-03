import {
  FileText, List, CheckSquare, XSquare, Clock3, Search, Sun, Bell, UserRound,
  ChartNoAxesColumnIncreasing, Target, Award, Grid2X2, Info, ArrowRight, Menu, X,
  Circle, FileSpreadsheet, Pentagon
} from "lucide-react";

const icons = {
  doc: FileText, list: List, check: CheckSquare, x: XSquare, clock: Clock3,
  search: Search, sun: Sun, bell: Bell, user: UserRound, bars: ChartNoAxesColumnIncreasing,
  target: Target, award: Award, grid: Grid2X2, info: Info, arrow: ArrowRight,
  menu: Menu, close: X, circle: Circle, spreadsheet: FileSpreadsheet, pent: Pentagon,
};

export default function Icon({ name, className = "h-5 w-5", ...props }) {
  const Component = icons[name] ?? FileText;
  return <Component className={className} strokeWidth={1.8} {...props} />;
}
