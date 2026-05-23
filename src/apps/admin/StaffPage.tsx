import { useStaff } from "@/hooks/useStaticQueries";
import { Mail, Phone, Shield, UserCheck, CreditCard, ChefHat, Users, Armchair } from "lucide-react";

function getRoleIcon(role: string) {
  switch (role) {
    case "manager": return <UserCheck className="w-3 h-3" />;
    case "cashier": return <CreditCard className="w-3 h-3" />;
    case "chef": return <ChefHat className="w-3 h-3" />;
    case "server": return <Users className="w-3 h-3" />;
    case "host": return <Armchair className="w-3 h-3" />;
    default: return <Users className="w-3 h-3" />;
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case "manager": return "bg-purple-100 text-purple-700";
    case "cashier": return "bg-blue-100 text-blue-700";
    case "chef": return "bg-orange-100 text-orange-700";
    case "server": return "bg-green-100 text-green-700";
    case "host": return "bg-pink-100 text-pink-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

export default function StaffPage() {
  const { data: staff } = useStaff();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-serif text-gray-900">Staff</h1>
        <p className="text-gray-500">{staff?.length ?? 0} team members</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff?.map(member => (
          <div key={member.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-[#166534] rounded-full flex items-center justify-center text-lg font-bold text-white">
                {member.name.charAt(0)}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${getRoleColor(member.role)}`}>
                {getRoleIcon(member.role)} {member.role}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <div className="mt-3 space-y-1.5">
              {member.email && <div className="flex items-center gap-2 text-sm text-gray-500"><Mail className="w-4 h-4" />{member.email}</div>}
              {member.phone && <div className="flex items-center gap-2 text-sm text-gray-500"><Phone className="w-4 h-4" />{member.phone}</div>}
              <div className="flex items-center gap-2 text-sm text-gray-500"><Shield className="w-4 h-4" />PIN: {member.pin}</div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-3 inline-block ${member.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {member.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
