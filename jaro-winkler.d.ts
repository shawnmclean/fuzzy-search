declare module "jaro-winkler" {
  function jaroWinkler(
    a: string,
    b: string,
    options?: { caseSensitive?: boolean }
  ): number;
  export = jaroWinkler;
}
