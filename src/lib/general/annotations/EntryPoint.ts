export const EntryPoint = (targetClass: { main: () => void } ): void  => {

  if (targetClass.main) {
    targetClass.main();
  } else {
    throw new Error("Entrypoint not found - 'public static main'.");
  }

};