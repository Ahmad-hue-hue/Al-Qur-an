"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core"

interface FaIconProps {
  icon: IconDefinition
  className?: string
  size?: "xs" | "sm" | "lg" | "xl" | "2x"
  fixedWidth?: boolean
}

export function FaIcon({ icon, className = "", size, fixedWidth = false }: FaIconProps) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      fontSize={size === "xs" ? "0.75em" : size === "sm" ? "0.875em" : size === "lg" ? "1.25em" : size === "xl" ? "1.5em" : size === "2x" ? "2em" : undefined}
      fixedWidth={fixedWidth}
    />
  )
}
