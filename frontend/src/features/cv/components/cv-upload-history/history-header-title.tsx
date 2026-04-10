export function HistoryHeaderTitle() {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.28em] text-stone-500">CV Upload History</p>
      <div className="mt-4 max-w-3xl space-y-4">
        <h1 className="text-[1.7rem] font-semibold leading-[1.14] tracking-tight text-stone-950 md:text-[2.3rem]">
          Review every resume version in one clean timeline.
        </h1>
        <p className="max-w-2xl text-[15px] leading-7 text-stone-600 md:text-[17px]">
          Track uploaded CVs, compare extracted snapshots, and reopen any version when you want to continue refining role fit.
        </p>
      </div>
    </>
  );
}
