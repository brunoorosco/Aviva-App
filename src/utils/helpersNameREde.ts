// Helper function no topo do componente ou em utils
export const getRedeName = (rede?: { _id: string; name: string } | string): string => {
  if (!rede) return "";
  if (typeof rede === "string") return rede;
  return rede.name || "";
};
