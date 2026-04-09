"use client";

import { useRouter } from "next/navigation";
import { Clock3, FileText, ScanText } from "lucide-react";
import { useEffect, useMemo, useTransition } from "react";
import { toast } from "sonner";
import { SectionCard } from "@/components/section-card";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCv, setCVs } from "@/store/cv-slice";
import { formatCvCreatedAt } from "../utils/cv-workspace";

export function CVUploadHistory() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const cvs = useAppSelector((state) => state.cv.items);
  const selectedCvId = useAppSelector((state) => state.cv.selectedCvId);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!token) return;
    startTransition(async () => {
      try {
        const records = await api.listCVs(token);
        dispatch(setCVs(records));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load CV history");
      }
    });
  }, [dispatch, token]);

  const recentCvs = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    return cvs.filter((cv) => {
      const createdAt = new Date(cv.created_at);
      return !Number.isNaN(createdAt.getTime()) && createdAt >= sevenDaysAgo;
    });
  }, [cvs]);

  const totalUploads = recentCvs.length;
  const verifiedUploads = recentCvs.filter((cv) => cv.latest_verification?.is_verified).length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[34px] border border-black/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(242,248,242,0.9)_48%,rgba(247,239,225,0.86))] shadow-[var(--shadow)]">
        <div className="grid gap-8 px-6 py-7 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">CV Upload History</p>
            <div className="mt-4 max-w-3xl space-y-4">
              <h1 className="text-[1.7rem] font-semibold leading-[1.14] tracking-tight text-stone-950 md:text-[2.3rem]">
                Review every resume version in one clean timeline.
              </h1>
              <p className="max-w-2xl text-[15px] leading-7 text-stone-600 md:text-[17px]">
                Track uploaded CVs, compare extracted snapshots, and reopen any version when you want to continue refining role fit.
              </p>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-black/10 bg-white/86 px-5 py-5 shadow-[0_16px_28px_rgba(43,43,35,0.04)]">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Total uploads</p>
                <p className="mt-3 text-[2.6rem] font-semibold leading-none text-stone-950">{totalUploads}</p>
                <p className="mt-3 text-sm leading-6 text-stone-600">Uploads from the last 7 days shown in this history view.</p>
              </div>
              <div className="rounded-[24px] border border-black/10 bg-white/86 px-5 py-5 shadow-[0_16px_28px_rgba(43,43,35,0.04)]">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Verified</p>
                <p className="mt-3 text-[2.6rem] font-semibold leading-none text-stone-950">{verifiedUploads}</p>
                <p className="mt-3 text-sm leading-6 text-stone-600">Readable CVs successfully extracted during the last week.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-black/10 bg-white/78 p-5 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-950">How to use history</p>
                <p className="mt-1 text-sm text-stone-600">A quick way to compare versions before your next update.</p>
              </div>
              <Clock3 className="h-5 w-5 text-amber-600" />
            </div>
            <div className="mt-5 space-y-3">
              {[
                { icon: FileText, title: "Review versions", detail: "Scan every upload in chronological order with score and extracted preview." },
                { icon: ScanText, title: "Reopen a draft", detail: "Select any saved CV to continue analysis from that exact version." },
                { icon: Clock3, title: "Track progress", detail: "Use the history to spot which uploads improved the role-fit score." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-black/10 bg-stone-50/80 px-4 py-4">
                    <div className="rounded-2xl bg-white p-2 shadow-sm">
                      <Icon className="h-5 w-5 text-emerald-800" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-950">{item.title}</p>
                      <p className="mt-1 text-sm text-stone-600">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <SectionCard
        title="Upload Timeline"
        description="CV uploads from the last 7 days with extracted preview, verification state, and latest score."
        className="bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,248,243,0.88))]"
      >
        {recentCvs.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentCvs.map((cv) => {
              const active = selectedCvId === cv.id;
              return (
                <button
                  key={cv.id}
                  onClick={() => {
                    dispatch(selectCv(cv.id));
                    router.push("/dashboard/cv");
                  }}
                  className={`overflow-hidden rounded-[24px] border px-5 py-5 text-left transition ${
                    active
                      ? "border-emerald-700 bg-[linear-gradient(135deg,rgba(217,243,225,0.96),rgba(255,255,255,0.96))]"
                      : "border-black/10 bg-white/84 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-stone-950">{formatCvCreatedAt(cv.created_at)}</p>
                    <span className="rounded-full bg-stone-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-50">
                      {cv.latest_analysis?.score ?? 0}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-stone-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Verification</p>
                      <p className="mt-2 text-sm font-semibold text-stone-900">
                        {cv.latest_verification?.is_verified ? "Verified" : "Pending"}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-stone-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Detected skills</p>
                      <p className="mt-2 text-sm font-semibold text-stone-900">
                        {parseInt(String((cv.latest_analysis?.full_json_state.match(/"skills":\[(.*?)\]/)?.[1]?.match(/"/g)?.length ?? 0) / 2 || 0), 10) || 0}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 break-words text-xs leading-6 text-stone-600">
                    {cv.raw_text?.slice(0, 180) || "No extracted text preview available for this upload."}
                  </p>
                  {cv.latest_verification?.details ? (
                    <p className="mt-3 break-words text-xs font-medium text-stone-500">{cv.latest_verification.details}</p>
                  ) : null}
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Open this version
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-stone-50 px-4 py-10 text-center text-sm text-stone-500">
            {isPending ? "Loading your CV history..." : "No CV uploads from the last 7 days are available."}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
