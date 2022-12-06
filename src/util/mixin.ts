export type GConstructor<T = {}, C = new (...args: any[]) => T> = C;

export function applyMixins<Base, Target>(
  base: GConstructor<Base>,
  mixins: ((Base: GConstructor<Base>) => GConstructor<Base & Partial<Target>>)[]
): GConstructor<Target> {
  // @ts-ignore
  return (mixins.reduce(
    (final: GConstructor<Base & Partial<Target>>, mixin) => mixin(final),
    base
  ) as any) as GConstructor<Target>;
}
