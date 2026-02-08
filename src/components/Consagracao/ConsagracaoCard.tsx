// components/consagracoes/ConsagracaoCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ConsagracaoHistory } from "@/domain/models/churchs";
import { useRouter } from "next/router";

interface ConsagracaoCardProps {
  consagracao: ConsagracaoHistory;
}

export function ConsagracaoCard({ consagracao }: ConsagracaoCardProps) {
  const router = useRouter();
  return (
    <Card className="w-full max-w-sm sm:max-w-md mx-auto shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">
          {new Date(consagracao.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
        </CardTitle>
        <div className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {/* {consagracao.mainRoleConsagrated.replace(/_/g, " ")} */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Total de Pessoas Consagradas:</span>{" "}
            {consagracao.totalConsagrated}
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold mb-1">Quantidade por Cargo:</p>
          <ul className="list-disc list-inside pl-2">
            {Object.entries(consagracao.rolesConsagrated)
              .sort(([, a], [, b]) => (b?.count ?? 0) - (a?.count ?? 0))
              .map(([role, data]) => (
                <li key={role} className="text-gray-600">
                  {data.role.replace(/_/g, " ")}: {data.count}
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        <Link href={`${router.asPath}/${consagracao._id}`} passHref>
          <Button>Editar</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
