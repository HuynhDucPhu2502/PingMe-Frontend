import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchAndFilterSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export function SearchAndFilterSection({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: SearchAndFilterSectionProps) {
  return (
    <div className="border-y border-border bg-card/50 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 shadow-sm border-border/50 focus-visible:ring-2"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full md:w-[200px] h-12 shadow-sm border-border/50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="TECHNOLOGY">Technology</SelectItem>
              <SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
              <SelectItem value="EDUCATION">Education</SelectItem>
              <SelectItem value="BUSINESS">Business</SelectItem>
              <SelectItem value="TRAVEL">Travel</SelectItem>
              <SelectItem value="FOOD">Food</SelectItem>
              <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
