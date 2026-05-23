import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Globe, CreditCard, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    allowSignups: true, requireApproval: false, emailNotifications: true,
    autoBackup: true, stripeIntegration: true, multiLanguage: false,
    darkModeDefault: false, analyticsEnabled: true, maintenanceMode: false,
  });
  const toggle = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    { title: "General", icon: Globe, items: [{ key: "allowSignups" as const, label: "Allow New Signups", desc: "Enable new pizzeria registrations" }, { key: "requireApproval" as const, label: "Require Approval", desc: "Manually approve new tenants" }, { key: "maintenanceMode" as const, label: "Maintenance Mode", desc: "Put platform in maintenance mode" }] },
    { title: "Notifications", icon: Bell, items: [{ key: "emailNotifications" as const, label: "Email Notifications", desc: "Send email alerts for important events" }] },
    { title: "Payments", icon: CreditCard, items: [{ key: "stripeIntegration" as const, label: "Stripe Integration", desc: "Enable Stripe payment processing" }] },
    { title: "System", icon: Shield, items: [{ key: "autoBackup" as const, label: "Auto Backup", desc: "Automatically backup database daily" }, { key: "analyticsEnabled" as const, label: "Analytics", desc: "Collect usage analytics" }] },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold font-serif text-gray-900">System Settings</h1><p className="text-gray-500">Configure platform-wide settings</p></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <Card key={section.title}><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Icon className="w-5 h-5 text-red-600" />{section.title}</CardTitle></CardHeader>
              <CardContent className="space-y-4">{section.items.map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div><p className="font-medium text-gray-900">{item.label}</p><p className="text-sm text-gray-500">{item.desc}</p></div>
                  <Switch checked={settings[item.key]} onCheckedChange={() => toggle(item.key)} />
                </div>
              ))}</CardContent></Card>
          );
        })}
      </div>
    </div>
  );
}
