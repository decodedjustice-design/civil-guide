import { useState, useMemo } from "react";
import { Search, Filter, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AttorneyCard } from "./AttorneyCard";
import { 
  sampleAttorneys, 
  WA_COUNTIES, 
  PRACTICE_AREAS, 
  FEE_TYPES 
} from "@/data/attorneyData";

export function AttorneyDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [practiceFilter, setPracticeFilter] = useState<string>("all");
  const [countyFilter, setCountyFilter] = useState<string>("all");
  const [feeFilter, setFeeFilter] = useState<string>("all");

  const filteredAttorneys = useMemo(() => {
    return sampleAttorneys
      .filter((attorney) => {
        // Search filter
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
          attorney.name.toLowerCase().includes(searchLower) ||
          attorney.firm.toLowerCase().includes(searchLower) ||
          attorney.city.toLowerCase().includes(searchLower);

        // Practice area filter
        const matchesPractice = practiceFilter === "all" || 
          attorney.practiceAreas.includes(practiceFilter);

        // County filter
        const matchesCounty = countyFilter === "all" || 
          attorney.counties.includes(countyFilter);

        // Fee type filter
        const matchesFee = feeFilter === "all" || 
          attorney.feeTypes.includes(feeFilter);

        return matchesSearch && matchesPractice && matchesCounty && matchesFee;
      })
      .sort((a, b) => a.firm.localeCompare(b.firm)); // Alphabetical by firm
  }, [searchQuery, practiceFilter, countyFilter, feeFilter]);

  const hasActiveFilters = practiceFilter !== "all" || countyFilter !== "all" || feeFilter !== "all";

  const clearFilters = () => {
    setPracticeFilter("all");
    setCountyFilter("all");
    setFeeFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Directory Disclaimer */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Decoded Justice is an information directory, not a referral or recommendation service.</strong>
          <br />
          Attorneys are listed alphabetically. Inclusion does not imply endorsement.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, firm, or city..."
          className="pl-12 h-12 rounded-xl"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Practice Area */}
          <Select value={practiceFilter} onValueChange={setPracticeFilter}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Practice Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Practice Areas</SelectItem>
              {PRACTICE_AREAS.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* County */}
          <Select value={countyFilter} onValueChange={setCountyFilter}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="County" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counties</SelectItem>
              {WA_COUNTIES.map((county) => (
                <SelectItem key={county} value={county}>{county}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Fee Type */}
          <Select value={feeFilter} onValueChange={setFeeFilter}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Fee Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fee Types</SelectItem>
              {FEE_TYPES.map((fee) => (
                <SelectItem key={fee} value={fee}>{fee}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active:</span>
          {practiceFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {practiceFilter}
              <button onClick={() => setPracticeFilter("all")} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {countyFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {countyFilter} County
              <button onClick={() => setCountyFilter("all")} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {feeFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {feeFilter}
              <button onClick={() => setFeeFilter("all")} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear All
          </Button>
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredAttorneys.length} of {sampleAttorneys.length} attorneys
      </p>

      {/* Results */}
      {filteredAttorneys.length > 0 ? (
        <div className="space-y-4">
          {filteredAttorneys.map((attorney) => (
            <AttorneyCard key={attorney.id} attorney={attorney} />
          ))}
        </div>
      ) : (
        /* No Results Fallback */
        <div className="py-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No attorneys found
            </h3>
            <p className="text-muted-foreground">
              Civil rights cases can be hard to place. <strong className="text-foreground">This is not your fault.</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters, or explore legal aid organizations below for additional support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button variant="hero" asChild>
                <Link to="/tools">
                  Continue Using Case Tools
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
