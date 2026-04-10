import type { ElementType, ReactNode } from "react";

export interface NavItemType {
  href: string;
  label: string;
  icon: ElementType;
}

export interface WrapperProps {
  children: ReactNode;
}