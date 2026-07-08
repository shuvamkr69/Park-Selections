import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

export function Container({
  as,
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag className={cn("container-px", className)}>{children}</Tag>;
}
