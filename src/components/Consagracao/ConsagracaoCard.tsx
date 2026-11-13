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
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 pb-2">
        <CardTitle className="text-lg font-bold w-full sm:w-auto">
          {new Date(consagracao.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
        </CardTitle>
        {/* Removed main role - not available in ConsagracaoHistory type */}
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
            {Object.entries(consagracao.rolesConsagrated || {})
              .sort(([, a], [, b]) => (b?.count ?? 0) - (a?.count ?? 0))
              .map(([role, data]) => (
                <li key={role} className="text-gray-600">
                  {role.replace(/_/g, " ")}: {data.count}
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0 gap-2">
        <div className="text-xs text-gray-500">
          {consagracao.concluedAt ? (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
              <span className="mr-1">✓</span> Finalizada em{" "}
              {new Date(consagracao.concluedAt).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
              })}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
              Pendente
            </span>
          )}
        </div>
        <Link href={`${router.asPath}/${consagracao._id}`} passHref>
          <Button variant={consagracao.concluedAt ? "outline" : "default"}>
            {consagracao.concluedAt ? "Visualizar" : "Editar"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
