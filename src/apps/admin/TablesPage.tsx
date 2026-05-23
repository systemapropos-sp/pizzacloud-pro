import { useTables } from "@/hooks/useStaticQueries";
import { LayoutGrid } from "lucide-react";

const sColors: Record<string, string> = {
  available: "bg-green-100 text-green-700 border-green-300",
  occupied: "bg-red-100 text-red-700 border-red-300",
  reserved: "bg-blue-100 text-blue-700 border-blue-300",
  cleaning: "bg-amber-100 text-amber-700 border-amber-300",
};

const sLabels: Record<string, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  cleaning: "Cleaning",
};

export default function TablesPage() {
  const { data: tables } = useTables();

  const sections = [...new Set(tables?.map(t => t.section) ?? [])];
  const availableCount = tables?.filter(t => t.status === "available").length ?? 0;
  const occupiedCount = tables?.filter(t => t.status === "occupied").length ?? 0;
  const reservedCount = tables?.filter(t => t.status === "reserved").length ?? 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-serif text-gray-900">Tables</h1>
        <p className="text-gray-500">{tables?.length ?? 0} tables &middot; {availableCount} available &middot; {occupiedCount} occupied &middot; {reservedCount} reserved</p>
      </div>
      <div className="space-y-6">
        {sections.map(section => (
          <div key={section}>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-red-600" />{section}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {tables?.filter(t => t.section === section).map(table => (
                <div key={table.id} className={`rounded-xl border-2 p-4 text-center ${sColors[table.status]}`}>
                  <p className="text-2xl font-bold">{table.number}</p>
                  <p className="text-xs font-medium capitalize mt-1">{sLabels[table.status]}</p>
                  <p className="text-xs opacity-70">{table.capacity} seats</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
