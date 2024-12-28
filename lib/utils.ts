export const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");
