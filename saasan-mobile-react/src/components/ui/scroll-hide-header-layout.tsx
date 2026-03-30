import type { ReactNode } from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "./page-header";

export interface ScrollHideHeaderLayoutProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: ReactNode;
  backButtonVariant?: "ghost" | "outline" | "default";
  backButtonShowText?: boolean;
  subHeader?: ReactNode;
  children: ReactNode;
  scrollThreshold?: number;
  className?: string;
}

export function ScrollHideHeaderLayout({
  title,
  subtitle,
  showBackButton = false,
  rightAction,
  backButtonVariant = "ghost",
  backButtonShowText = false,
  subHeader,
  children,
  scrollThreshold = 50,
  className = "min-h-screen bg-gray-50 flex flex-col",
}: ScrollHideHeaderLayoutProps) {
  const headerInnerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState(0);

  const lastScrollTopRef = useRef(0);

  useLayoutEffect(() => {
    if (!headerInnerRef.current) return;
    const nextHeight = headerInnerRef.current.getBoundingClientRect().height;
    if (Number.isFinite(nextHeight)) setMeasuredHeaderHeight(nextHeight);
  }, [title, subtitle, showBackButton, rightAction, backButtonVariant]);

  const scrollLogic = useMemo(() => {
    return () => {
      const el = scrollRef.current;
      if (!el) return;

      const current = el.scrollTop;
      const last = lastScrollTopRef.current;
      if (current <= 0) {
        if (!isHeaderVisible) setIsHeaderVisible(true);
        lastScrollTopRef.current = current;
        return;
      }

      const isScrollingDown = current > last;

      if (isScrollingDown) {
        if (current > scrollThreshold) {
          if (isHeaderVisible) setIsHeaderVisible(false);
        }
      } else {
        if (!isHeaderVisible) setIsHeaderVisible(true);
      }

      lastScrollTopRef.current = current;
    };
  }, [scrollThreshold, isHeaderVisible]);

  const headerHeightPx =
    measuredHeaderHeight > 0
      ? isHeaderVisible
        ? measuredHeaderHeight
        : 0
      : undefined;

  return (
    <div className={className}>
      <div
        style={{
          height: headerHeightPx,
          transition: "height 200ms ease-in-out",
          overflow: "hidden",
        }}
      >
        <div ref={headerInnerRef}>
          <PageHeader
            title={title}
            subtitle={subtitle}
            showBackButton={showBackButton}
            showLogout={false}
            rightAction={rightAction}
            backButtonVariant={backButtonVariant}
            backButtonShowText={backButtonShowText}
          />
        </div>
      </div>

      {subHeader}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        onScroll={scrollLogic}
      >
        {children}
      </div>
    </div>
  );
}

