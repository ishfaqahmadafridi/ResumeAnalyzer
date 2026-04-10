import { WorkspaceHeaderStats } from "./workspace-header-stats";

export function WorkspaceHeaderBanner({ recentCount }: { recentCount: number }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_26%),linear-gradient(135deg,rgba(248,250,252,0.98),rgba(255,248,240,0.96))] p-6 shadow-[0_26px_55px_rgba(56,56,40,0.08)]">
      <div className="absolute right-[-38px] top-[-42px] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),transparent_68%)]" />
      <div className="absolute bottom-[-46px] left-[18%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_72%)]" />
      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <h3 className="max-w-3xl text-2xl font-semibold tracking-tight text-stone-950 sm:text-[2rem] sm:leading-[1.18]">
            Give every CV upload a sharper role direction and a better next step.
          </h3>
          <p className="mt-4 max-w-3xl text-[15px] leading-8 text-stone-600 sm:text-base">
            Keep the workflow simple: upload a clean resume, review the strongest profile signals, and move into role-fit analysis with a workspace that feels focused and polished.
          </p>
        </div>
        <WorkspaceHeaderStats recentCount={recentCount} />
      </div>
    </div>
  );
}
