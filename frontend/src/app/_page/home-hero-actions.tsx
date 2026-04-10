import Link from "next/link";

export function HomeHeroActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Link href="/auth/register" className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-semibold text-emerald-50">
        Create account
      </Link>
      <Link href="/auth/login" className="rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-900">
        Sign in
      </Link>
    </div>
  );
}
