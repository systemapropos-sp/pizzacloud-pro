import { trpc } from "@/providers/trpc";
import { Building2, Phone, Mail, MapPin, Clock, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TenantPage() {
  const { data: menuItems } = trpc.menu.items.useQuery({});
  const { data: staff } = trpc.staff.list.useQuery({});
  const { data: tables } = trpc.table.list.useQuery({});

  const tenant = { name: "Napoli Pizza", slug: "napoli-pizza", address: "789 Little Italy, New York, NY 10013", phone: "(212) 555-0199", email: "hello@napolipizza.com", timezone: "America/New_York", currency: "USD", status: "active", plan: "professional", taxRate: "8.875" };

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-bold font-serif text-gray-900">Tenant Management</h1><p className="text-gray-500">Manage pizzeria tenants</p></div>
      <div className="bg-white rounded-xl border overflow-hidden mb-6">
        <div className="p-6 border-b bg-gradient-to-r from-red-50 to-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center"><Building2 className="w-7 h-7 text-white" /></div>
              <div><h2 className="text-xl font-bold text-gray-900">{tenant.name}</h2><p className="text-sm text-gray-500">{tenant.slug}</p></div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-amber-100 text-amber-700"><BadgeCheck className="w-3 h-3 mr-1" />{tenant.plan}</Badge>
              <Badge className="bg-green-100 text-green-700">{tenant.status}</Badge>
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Contact Information</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600"><MapPin className="w-4 h-4 text-gray-400" />{tenant.address}</div>
            <div className="flex items-center gap-3 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400" />{tenant.phone}</div>
            <div className="flex items-center gap-3 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400" />{tenant.email}</div>
            <div className="flex items-center gap-3 text-sm text-gray-600"><Clock className="w-4 h-4 text-gray-400" />{tenant.timezone}</div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Configuration</h3>
            <div className="flex items-center justify-between text-sm py-2 border-b"><span className="text-gray-600">Currency</span><span className="font-medium">{tenant.currency}</span></div>
            <div className="flex items-center justify-between text-sm py-2 border-b"><span className="text-gray-600">Tax Rate</span><span className="font-medium">{tenant.taxRate}%</span></div>
            <div className="flex items-center justify-between text-sm py-2 border-b"><span className="text-gray-600">Online Orders</span><span className="text-green-600 font-medium">Enabled</span></div>
            <div className="flex items-center justify-between text-sm py-2 border-b"><span className="text-gray-600">Supabase Bucket</span><span className="text-green-600 font-medium">Connected</span></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5 text-center"><p className="text-3xl font-bold text-red-600">{menuItems?.length ?? 0}</p><p className="text-sm text-gray-500 mt-1">Menu Items</p></div>
        <div className="bg-white rounded-xl border p-5 text-center"><p className="text-3xl font-bold text-blue-600">{staff?.length ?? 0}</p><p className="text-sm text-gray-500 mt-1">Staff Members</p></div>
        <div className="bg-white rounded-xl border p-5 text-center"><p className="text-3xl font-bold text-green-600">{tables?.length ?? 0}</p><p className="text-sm text-gray-500 mt-1">Tables</p></div>
        <div className="bg-white rounded-xl border p-5 text-center"><p className="text-3xl font-bold text-amber-600">5</p><p className="text-sm text-gray-500 mt-1">Categories</p></div>
      </div>
    </div>
  );
}
