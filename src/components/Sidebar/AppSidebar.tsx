import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, ChevronUp, User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { menuItems } from "./menuRoute";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;
  const cemId = session?.user.cem?._id as string;
  const permission = (session?.user?.permission ?? []) as string[];
  const role = session?.user?.role ?? "";
  const roles = [...new Set([role, ...permission])];

  const items = menuItems({ churchId, cemId });
  const router = useRouter()

  const isAdmin = roles.includes("admin");
  const filteredItems = items
    .filter((item) => {
      const itemRoles = item.roles;
      if (isAdmin) return true;
      if (itemRoles === undefined) return true; // público
      if (Array.isArray(itemRoles) && itemRoles.length === 0) return false; // reservado p/ admin
      return itemRoles.some((r: string) => roles.includes(r));
    })
    .map((item) => ({
      ...item,
      children: item.children?.filter((sub) => {
        //@ts-ignore
        const subRoles = sub.roles ?? sub.role;
        if (isAdmin) return true;
        if (subRoles === undefined) return true;
        if (Array.isArray(subRoles) && subRoles.length === 0) return false;
        return subRoles.some((r: string) => roles.includes(r));
      }),
    }));

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center">
          <img src="/logo-preto.png" width="80%" className="mx-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Avivamento Sede</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) =>
                item.children ? (
                  <Collapsible key={item.label} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon size={20} />
                          <span className="text-md">{item.label}</span>
                          <ChevronRight
                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                            size={16}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((sub) => (
                            <SidebarMenuSubItem key={sub.label}>
                              <SidebarMenuButton asChild>
                                <a href={sub.link}>
                                  <sub.icon size={18} />
                                  <span>{sub.label}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a href={item.link}>
                        <item.icon size={20} />
                        <span className="text-md">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {session?.user.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={()=> router.push(`/app/${churchId}/users/settings`)}>
                  <span>Conta</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <BiLogOut /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
