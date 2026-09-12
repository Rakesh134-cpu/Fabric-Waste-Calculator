import React from 'react';
import { Building2, Save, Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f3f5f3] text-slate-800">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/60 px-8 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <SettingsIcon className="h-4 w-4" />
          <span className="text-sm text-slate-600">Configure EcoCut AI for your production environment.</span>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4 text-slate-900">
            <Building2 className="h-5 w-5 text-emerald-600" />
            <h1 className="text-3xl font-semibold">Company Profile</h1>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Company Name</label>
                <input value="Precision Garments Pvt Ltd" readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Factory Location</label>
                <input value="Tiruppur, Tamil Nadu" readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Production Capacity</label>
                <input value="2,400 units/day" readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Primary Products</label>
                <input value="Shirts, Pants, Kids wear" readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Contact Email</label>
                <input value="ops@precisiongarments.in" readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Contact Phone</label>
                <input value="+91 98765 43210" readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none" />
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => toast.success('Settings saved successfully.')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
