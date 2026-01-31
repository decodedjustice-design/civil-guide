import { useState } from "react";

export type Attorney = {
  name: string;
  organization: string;
  practiceAreas: string[];
  counties: string[];
  feeTypes: string[];
  contact: string;
};

const SAMPLE_ATTORNEYS: Attorney[] = [
  {
    name: "Jane Doe",
    organization: "Doe Civil Rights Law",
    practiceAreas: ["Police Misconduct", "Civil Rights"],
    counties: ["King", "Thurston"],
    feeTypes: ["Contingency"],
    contact: "https://examplelawfirm.com/contact"
  },
  {
    name: "John Smith",
    organization: "Smith Justice Group",
    practiceAreas: ["Housing Discrimination"],
    counties: ["Pierce", "King"],
    feeTypes: ["Sliding Scale"],
    contact: "mailto:intake@smithjustice.org"
  }
];

export default function AttorneySearch() {
  const [query, setQuery] = useState("");

  const results = SAMPLE_ATTORNEYS.filter(a =>
    a.practiceAreas.join(" ").toLowerCase().includes(query.toLowerCase()) ||
    a.counties.join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Find Legal Help</h2>

      <input
        type="text"
        placeholder="Search by issue or county (e.g. police, King)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded p-2"
      />

      <div className="space-y-3">
        {results.map((a, i) => (
          <div key={i} className="border rounded p-3">
            <div className="font-medium">{a.name}</div>
            <div className="text-sm text-gray-600">{a.organization}</div>
            <div className="text-sm">
              <strong>Areas:</strong> {a.practiceAreas.join(", ")}
            </div>
            <div className="text-sm">
              <strong>Counties:</strong> {a.counties.join(", ")}
            </div>
            <div className="text-sm">
              <strong>Fees:</strong> {a.feeTypes.join(", ")}
            </div>
            <a
              href={a.contact}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 underline text-sm"
            >
              Contact
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
