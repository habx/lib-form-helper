export type Except<BaseType, ExcludedElements> = Pick<
  BaseType,
  Exclude<keyof BaseType, ExcludedElements>
>
