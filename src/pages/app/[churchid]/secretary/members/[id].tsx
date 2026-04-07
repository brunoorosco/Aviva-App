import Loading from "@/components/Select/loading";
import { useHttpGet } from "@/hooks/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "@/domain/models/users";
import { MemberCard } from "@/components/Member/MemberCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenIcon } from "lucide-react";

const MembersById = () => {
  const router = useRouter();
  const { query } = router;
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;
  const cemId = session?.user.cem._id as string;

  const {
    data: member,
    error,
    isLoading,
  } = useHttpGet<User>(`/api/protected/churches/${churchId}/redes/${cemId}/members/${query.id}`);

  if (error) return <p>Ocorreu um erro: {error.message}</p>;
  if (isLoading) return <Loading />;
  if (!member?.data) return <p>Membro não encontrado.</p>;

  return (
    <div className="min-h-screen bg-gradient-bg p-2 max-w-8xl mx-auto">
      <div className="flex items-center justify-end md:justify-start">
        <div></div> {/* Espaço vazio para empurrar o botão para o lado oposto */}
        <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <div className="mt-4">
        <MemberCard member={member.data} />
      </div>
    </div>
  );
};

export default MembersById;
