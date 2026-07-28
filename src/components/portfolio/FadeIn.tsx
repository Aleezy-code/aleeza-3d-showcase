import { motion, type HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";

interface FadeInProps extends Omit<HTMLMotionProps<"div">, "as"> {
  as?: ElementType;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  children: ReactNode;
}

export function FadeIn({
  as,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  children,
  ...rest
}: FadeInProps) {
  const Comp = motion.create((as ?? "div") as ElementType);
  return (
    <Comp
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
