import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  scrollThreshold = 10,
  className = "min-h-screen bg-gray-50 flex flex-col",
}: ScrollHideHeaderLayoutProps) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollYRef = useRef<number>(0);
  const ticking = useRef(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState(0);

  // measure header height and keep it updated via resize observer
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (Number.isFinite(h) && h > 0) setMeasuredHeaderHeight(h);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const getScrollY = () =>
      Math.max(0, window.scrollY ?? document.documentElement.scrollTop ?? 0);

    lastScrollYRef.current = getScrollY();

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        ticking.current = false;

        const current = getScrollY();
        const last = lastScrollYRef.current;
        const delta = current - last;
        lastScrollYRef.current = current;

        // At the very top — always show
        if (current <= 0) {
          setIsHeaderVisible(true);
          return;
        }

        // Scrolling down past threshold — hide
        if (delta > 0 && current > scrollThreshold) {
          setIsHeaderVisible(false);
          return;
        }

        // Scrolling up — show
        if (delta < 0) {
          setIsHeaderVisible(true);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollThreshold]);

  return (
    <div className={className}>
      {/* Header always reserves its space via a static placeholder */}
      <div
        style={{ height: measuredHeaderHeight, flexShrink: 0 }}
        aria-hidden="true"
      />

      <div
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out`}
        style={{
          transform: isHeaderVisible ? "translateY(0)" : `translateY(-100%)`,
          willChange: "transform",
        }}
      >
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

      <div>
        {subHeader}
        {children}
      </div>
    </div>
  );
}
