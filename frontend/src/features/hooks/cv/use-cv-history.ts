import { useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCv, setCVs } from "@/store/cv-slice";
import { filterRecentCVs } from "@/features/utils/cv/history-calculations";
import type { UseCVHistoryResult, CVHistoryItemType } from "@/features/types/cv/history";

export function useCVHistory(): UseCVHistoryResult {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: any) => state.auth.token);
  const cvs = useAppSelector((state: any) => state.cv.items as CVHistoryItemType[]);
  const selectedCvId = useAppSelector((state: any) => state.cv.selectedCvId);
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

  const recentCvs = useMemo(() => filterRecentCVs(cvs), [cvs]);
  const totalUploads = recentCvs.length;
  const verifiedUploads = recentCvs.filter((cv) => cv.latest_verification?.is_verified).length;

  const onSelectCv = (id: string) => {
    dispatch(selectCv(id));
    router.push("/dashboard/cv");
  };

  return {
    recentCvs,
    totalUploads,
    verifiedUploads,
    selectedCvId,
    isPending,
    onSelectCv,
  };
}
