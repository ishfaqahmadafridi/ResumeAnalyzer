import { SectionCard } from "@/components/ui/section-card";

export default function DashboardProfilePage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Profile Settings"
        description="Manage the account details that support your CV analysis workflow."
      >
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] border border-black/8 bg-stone-50/90 p-5">
            <p className="text-sm font-semibold text-stone-900">Profile photo</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Add a profile image so your account area feels more personal across the dashboard.
            </p>
            <div className="mt-5 flex h-28 w-28 items-center justify-center rounded-full bg-[linear-gradient(135deg,#34d399,#22c55e)] text-3xl font-semibold text-white">
              U
            </div>
            <button className="mt-5 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white">
              Upload photo
            </button>
          </div>
          <div className="grid gap-5">
            <div className="rounded-[24px] border border-black/8 bg-stone-50/90 p-5">
              <p className="text-sm font-semibold text-stone-900">Account details</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">First name</label>
                  <input className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none" placeholder="First name" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Last name</label>
                  <input className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none" placeholder="Last name" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Username</label>
                  <input className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none" placeholder="Username" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Email</label>
                  <input className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none" placeholder="Email" />
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-black/8 bg-stone-50/90 p-5">
              <p className="text-sm font-semibold text-stone-900">Password & security</p>
              <div className="mt-4 grid gap-4">
                <input
                  type="password"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none"
                  placeholder="Current password"
                />
                <input
                  type="password"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none"
                  placeholder="New password"
                />
                <input
                  type="password"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-stone-900 outline-none"
                  placeholder="Confirm new password"
                />
                <button className="w-fit rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
                  Update password
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
