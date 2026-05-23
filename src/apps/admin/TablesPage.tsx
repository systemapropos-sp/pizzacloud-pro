import { trpc } from "@/providers/trpc";
import { Armchair } from "lucide-react";

const sColors: Record<string, string> = { available: "bg-green-100 text-green-700 border-green-300", occupied: "bg-red-100 text-red-700 border-red-300", reserved: "bg-blue-100 text-blue-700 border-blue-300", cleaning: "bg-amber-100 text-amber-700 border-amber-300" };

export default function TablesPage() {
  const { data: tables, isLoading } = trpc.table.list.useQuery();

  if (isLoading) return <div className="p-8 text-center text-gray-400">Loading...</div>;

  const sections = [...new Set(tables?.map(t => t.section) ?? [])];

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold font-serif text-gray-900">Tables</h1><p className="text-gray-500">Floor plan</p></div>
      <div className="space-y-6">
        {sections.map(section => (
          <div key={section}>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Armchair className="w-5 h-5 text-red-600" />{section}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {tables?.filter(t => t.section === section).map(table => (
                <div key={table.id} className={`rounded-xl border-2 p-4 text-center ${sColors[table.status]}`}>
                  <p className="text-2xl font-bold">{table.number}</p>
                  <p className="text-xs capitalize mt-1">{table.status}</p>
                  <p className="text-xs opacity-70">{table.capacity} seats</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-4 flex flex-wrap gap-6 mt-6">
        {["Total", "Available", "Occupied", "Reserved"].map((label, i) => (
          <div key={label} className="text-center">
            <p className={`text-2xl font-bold ${i === 0 ? "text-gray-900" : i === 1 ? "text-green-600" : i === 2 ? "text-red-600" : "text-blue-600"}`}>{i === 0 ? tables?.length : i === 1 ? tables?.filter(t => t.status === "available").length : i === 2 ? tables?.filter(t => t.status === "occupied").length : tables?.filter(t => t.status === "reserved").length ?? 0}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
