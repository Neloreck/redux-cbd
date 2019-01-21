
let called: boolean = false;

export function EntryPoint(shouldCall?: boolean) {

  return (targetClass: { main: (argv: Array<string>) => void } ): void  => {

    if (shouldCall === false) {
      return;
    }

    if (targetClass.main && !called) {
      targetClass.main(process.argv);
      called = true;
    } else if (called) {
      throw new Error("Entrypoint: already called.");
    } else if (!targetClass.main) {
      throw new Error("Entrypoint: not found entry - 'public static main(): void'.");
    }
  };
}
