"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud";

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40%",
      paddingTop: 40,
      margin: "0 auto",
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
    // dragControl: false,
  },
};

export const renderCustomIcon = (icon: SimpleIcon, theme: string, bgHex?: string) => {
  const bg = bgHex ?? (theme === "light" ? "#f3f2ef" : "#080510");
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  return renderSimpleIcon({
    icon,
    bgHex: bg,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  });
};

export type DynamicCloudProps = {
  iconSlugs: string[];
  /** Background the icons are contrast-checked against in light mode. */
  bgHexLight?: string;
  /** Background the icons are contrast-checked against in dark mode. */
  bgHexDark?: string;
  /** Merged over the default container style (width 40%, centered). */
  containerStyle?: React.CSSProperties;
};

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;

export default function IconCloud({ iconSlugs, bgHexLight, bgHexDark, containerStyle }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme ?? "light";

  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
  }, [iconSlugs]);

  const renderedIcons = useMemo(() => {
    if (!data) return null;
    const bg = theme === "light" ? bgHexLight : bgHexDark;
    return Object.values(data.simpleIcons).map((icon) => renderCustomIcon(icon, theme, bg));
  }, [data, theme, bgHexLight, bgHexDark]);

  const props: Omit<ICloud, "children"> = {
    ...cloudProps,
    containerProps: {
      ...cloudProps.containerProps,
      style: { ...cloudProps.containerProps?.style, ...containerStyle },
    },
  };

  return (
    // @ts-ignore
    <Cloud {...props}>
      <>{renderedIcons}</>
    </Cloud>
  );
}
