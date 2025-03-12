import { Npc } from '../model/osrs/npc.model';

export function npcFuzzySearch(npc: Npc, searchTerm: string, allAbbreviations: Record<string, string[]>): boolean {
  if (!searchTerm) return true;
  const name = npc.name;
  const abbreviations = allAbbreviations[name];

  const isNpcType = (npc: Npc, searchTerm: string): boolean => {
    if (
      npc.isXerician &&
      allAbbreviations['Chambers of Xeric'].some((abb: string) => abb.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return true;
    }

    if (
      (npc.isTobEntryMode || npc.isTobNormalMode || npc.isTobHardMode) &&
      allAbbreviations['Theatre of Blood'].some((abb: string) => abb.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return true;
    }

    if (npc.isDragon && 'dragon'.includes(searchTerm.toLowerCase())) {
      return true;
    }

    if (npc.isDemon && 'demon'.includes(searchTerm.toLowerCase())) {
      return true;
    }

    if (npc.isKalphite && 'kalphite'.includes(searchTerm.toLowerCase())) {
      return true;
    }

    if (npc.isUndead && 'undead'.includes(searchTerm.toLowerCase())) {
      return true;
    }

    return false;
  };

  return (
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name
      .replace(/[^0-9a-z]/gi, '')
      .toLowerCase()
      .includes(searchTerm.replace(/[^0-9a-z]/gi, '').toLowerCase()) ||
    abbreviations?.some((abb: string) => abb.toLowerCase().includes(searchTerm.toLowerCase())) ||
    isNpcType(npc, searchTerm)
  );
}
