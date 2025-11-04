"use client";

import Link from "next/link";
import Toast from "@/components/Toast";
import ButtonNew from "@/components/ButtonSubmit/buttonAdd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CellsModel } from "@/domain/models/cells";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { Pencil } from "lucide-react";

const Cem = () => {
  const router = useRouter();
  const churchId = router.query?.churchid;
  const { data: session } = useSession();
  const { data: cems, mutate } = useHttpGet<CellsModel[]>(
    `/api/protected/churches/${session?.user.churchId}/cems`
  );
  const isAdmin = session?.user.permission?.includes("admin");
  const userCem = session?.user.cem._id;

  const handleDelete = async (id: string) => {
    Toast.showDelete(`/api/protected/churches/${session?.user.churchId}/cems/${id}`);
    await mutate();
  };

  const goToMembers = (cemId: string) => {
    if (isAdmin || cemId === userCem) router.push(`/app/${churchId}/cems/${cemId}/members`);
  };

  return (
    <div className="flex flex-col w-full max-w-6xl p-3 mx-auto rounded-lg dark:text-dark-primary">
      <Suspense fallback={<p>Carregando Redes...</p>}>
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-3 py-4  rounded-lg dark:bg-dark-secondary">
          <div>
            <p className="text-2xl font-bold">Nossas Redes</p>
          </div>
          <Link href={`../${churchId}/cems/new`}>
            <ButtonNew />
          </Link>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {cems?.data.map((cem: CellsModel) => (
            <div key={cem._id} className="relative">
              {isAdmin && (
                <Link
                  href={`../${churchId}/cems/${cem._id}`}
                  onClick={(e) => e.stopPropagation()} // evita abrir membros
                  className="absolute top-2 left-2 z-10 hover:bg-gray-200 hover:rounded-full p-1.5"
                >
                  <Pencil className="w-4 h-4 text-gray-400" />
                </Link>
              )}

              <Card
                className={`rounded-2xl shadow-md hover:shadow-lg transition ${
                  (cem._id === userCem || isAdmin) ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => goToMembers(cem._id)}
              >
                <CardHeader className="flex flex-col items-center">
                  <CardTitle className="-mb-2 text-lg">{cem.name}</CardTitle>
                  <span className="text-sm line-clamp-1">{cem.description}</span>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-2 text-xl font-semibold">
                    {cem.membersActive || 0} <span className="text-base font-normal">membros</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default Cem;
