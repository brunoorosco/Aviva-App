import React from "react";
import { useHttpGet } from "@/hooks/api";
import { useRouter } from "next/router";
import { User } from "@/domain/models/users";
import SkeletonDashboard from "@/components/Dashboard/SkeletonCell";
import CellDashboard from "@/components/Dashboard/CellDashboard";

export default function Dashboard() {
  const router = useRouter();
  const { churchid } = router.query;

  const { data: users } = useHttpGet<{
    data: User[];
  }>(`/api/protected/churches/${churchid}/users?limit=1000`);

  if (!users?.data) {
    return <SkeletonDashboard />;
  }

  return <CellDashboard members={users.data.data as User[]} />;
}
