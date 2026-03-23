import type { PokemonDetails } from '../types/pokemon';

/**
 * PokeAPI `/pokemon/{id}` zwraca bardzo duży JSON (m.in. setki wpisów w `moves`, dziesiątki URL w `sprites`).
 * Aplikacja używa tylko id, name, wybranych sprite’ów, typów i statystyk — obcinamy resztę po stronie klienta
 * (rozmiar odpowiedzi HTTP się nie zmienia, ale mniej RAM-u, mniejsze cache i zapis pinów).
 */
export function normalizePokemonFromApi(raw: unknown): PokemonDetails {
  const r = raw as Record<string, unknown>;
  const sprites = r.sprites as Record<string, unknown> | undefined;
  const other = sprites?.other as Record<string, unknown> | undefined;
  const official = other?.['official-artwork'] as { front_default?: string } | undefined;

  const frontDefault =
    typeof sprites?.front_default === 'string' ? sprites.front_default : '';
  const officialFront =
    typeof official?.front_default === 'string' ? official.front_default : undefined;

  const typesRaw = Array.isArray(r.types) ? r.types : [];
  const types = typesRaw.map((t: { slot: number; type: { name: string } }) => ({
    slot: t.slot,
    type: { name: t.type.name },
  }));

  const statsRaw = Array.isArray(r.stats) ? r.stats : [];
  const stats = statsRaw.map((s: { base_stat: number; stat: { name: string } }) => ({
    base_stat: s.base_stat,
    stat: { name: s.stat.name },
  }));

  return {
    id: r.id as number,
    name: r.name as string,
    sprites: {
      front_default: frontDefault,
      ...(officialFront
        ? { other: { 'official-artwork': { front_default: officialFront } } }
        : {}),
    },
    types,
    stats,
  };
}
