import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Search, Filter, X, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AttorneyCard } from "./AttorneyCard";
import { WA_COUNTIES, PRACTICE_AREAS, FEE_TYPES, type Attorney } from "@/data/attorneyData";
import { supabase } from "@/integrations/supabase/client";

type DirectoryRow = {
  id: string;
  name: string;
  entry_type: string;
  firm_or_org: string | null;
  city: string;
  state: string;
  county: string | null;
  counties_served: string[];
  practice_areas: string[];
  fee_types: string[];
  website_url: string | null;
  intake_phone: string | null;
  intake_email: string | null;
  bar_number: string | null;
  accepts_case_builder_summary: boolean;
  verification_status: string;
  source_url: string | null;
  source_type: string | null;
  last_verified_at: string | null;
  verification_note: string | null;
};

function toAttorney(row: DirectoryRow): Attorney {
  return {
    id: row.id,
    name: row.name,
    firm: row.firm_or_org || row.name,
    city: row.city,
    practiceAreas: row.practice_areas || [],
    counties: row.counties_served?.length ? row.counties_served : row.county ? [row.county] : [],
    feeTypes: row.fee_types || [],
    contactMethod: row.website_url ? "website" : row.intake_email ? "email" : "phone",
    contactValue: row.website_url || row.intake_email || row.intake_phone || "",
    email: row.intake_email || undefined,
    phone: row.intake_phone || undefined,
    barAdmissions: row.bar_number ? [row.bar_number] : undefined,
    description: row.verification_note || undefined,
    entryType: row.entry_type,
    verificationStatus: row.verification_status,
    sourceUrl: row.source_url || undefined,
    sourceType: row.source_type || undefined,
    lastVerifiedAt: row.last_verified_at || undefined,
  };
}

function MultiFilter({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const count = selected.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between h-10 font-normal">
          <span>{label}{count ? ` · ${count}` : ""}</span>
          <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Filter by {label.toLowerCase()}</p>
          {count > 0 && (
            <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
          {options.map((option) => {
            const checked = selected.includes(option);
            return (
              <label key={option} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-secondary cursor-pointer">
                <Checkbox checked={checked} onCheckedChange={() => onToggle(option)} />
                <span className="text-sm">{option}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AttorneyDirectory() {
  const [entries, setEntries] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [practiceFilters, setPracticeFilters] = useState<string[]>([]);
  const [countyFilters, setCountyFilters] = useState<string[]>([]);
  const [feeFilters, setFeeFilters] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchDirectoryEntries() {
      setLoading(true);
      setLoadError(null);

      let query = supabase
        .from("directory_entries")
        .select("*")
        .eq("active_listing", true)
        .order("firm_or_org", { ascending: true })
        .order("name", { ascending: true });

      if (practiceFilters.length) {
        query = query.overlaps("practice_areas", practiceFilters);
      }

      if (countyFilters.length) {
        query = query.overlaps("counties_served", countyFilters);
      }

      if (feeFilters.length) {
        query = query.overlaps("fee_types", feeFilters);
      }

      const normalizedSearch = searchQuery.trim().replace(/[(),]/g, " ");
      if (normalizedSearch) {
        query = query.or(
          `name.ilike.%${normalizedSearch}%,firm_or_org.ilike.%${normalizedSearch}%,city.ilike.%${normalizedSearch}%`,
        );
      }

      const { data, error } = await query;

      if (cancelled) return;

      if (error) {
        console.error("Error fetching directory:", error);
        setLoadError("The directory could not be loaded right now.");
        setEntries([]);
      } else {
        setEntries((data as DirectoryRow[]).map(toAttorney));
      }

      setLoading(false);
    }

    void fetchDirectoryEntries();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, practiceFilters, countyFilters, feeFilters]);

  const hasActiveFilters = practiceFilters.length > 0 || countyFilters.length > 0 || feeFilters.length > 0;

  const toggle = (setter: Dispatch<SetStateAction<string[]>>, value: string) => {
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const clearFilters = () => {
    setPracticeFilters([]);
    setCountyFilters([]);
    setFeeFilters([]);
    setSearchQuery("");
  };

  const activeFilterCount = practiceFilters.length + countyFilters.length + feeFilters.length;

  const filterSummary = useMemo(() => {
    const labels = [
      ...practiceFilters,
      ...countyFilters.map((c) => `${c} County`),
      ...feeFilters,
    ];
    return labels;
  }, [practiceFilters, countyFilters, feeFilters]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Decoded Justice is an information directory, not a referral or recommendation service.</strong>
          <br />
          Listings are sourced from public information and should be independently verified before contact or engagement.
        </p>
      </div>

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

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span>Filter results</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount} selected</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MultiFilter
            label="Practice Area"
            options={PRACTICE_AREAS}
            selected={practiceFilters}
            onToggle={(value) => toggle(setPracticeFilters, value)}
            onClear={() => setPracticeFilters([])}
          />
          <MultiFilter
            label="County"
            options={[...WA_COUNTIES, "Statewide"]}
            selected={countyFilters}
            onToggle={(value) => toggle(setCountyFilters, value)}
            onClear={() => setCountyFilters([])}
          />
          <MultiFilter
            label="Fee Type"
            options={FEE_TYPES}
            selected={feeFilters}
            onToggle={(value) => toggle(setFeeFilters, value)}
            onClear={() => setFeeFilters([])}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active:</span>
          {filterSummary.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <button
                onClick={() => {
                  setPracticeFilters((items) => items.filter((item) => item !== filter));
                  setCountyFilters((items) => items.filter((item) => `${item} County` !== filter && item !== filter));
                  setFeeFilters((items) => items.filter((item) => item !== filter));
                }}
                className="ml-1 hover:text-destructive"
                aria-label={`Remove ${filter} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear All
          </Button>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Loading legal-help directory…</div>
      ) : loadError ? (
        <div className="py-10 text-center rounded-xl bg-card border border-border">
          <p className="text-sm font-medium text-foreground">{loadError}</p>
          <p className="text-sm text-muted-foreground mt-2">Try again in a moment or use the official resources below.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {entries.length} directory {entries.length === 1 ? "entry" : "entries"}.
          </p>

          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((attorney) => (
                <AttorneyCard key={attorney.id} attorney={attorney} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No directory entries found</h3>
                <p className="text-muted-foreground">
                  Try broadening the search or removing a filter.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
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
        </>
      )}
    </div>
  );
}
