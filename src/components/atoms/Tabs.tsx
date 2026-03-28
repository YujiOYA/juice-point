"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface Props {
  items: TabItem[];
  defaultId?: string;
}

export default function Tabs({ items, defaultId }: Props) {
  const [activeId, setActiveId] = useState(defaultId ?? items[0]?.id);
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = listRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = listRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, []);

  const scrollLeft = () => {
    listRef.current?.scrollBy({ left: -120, behavior: "smooth" });
  };

  const scrollRight = () => {
    listRef.current?.scrollBy({ left: 120, behavior: "smooth" });
  };

  return (
    <div className="tabs">
      <div className="tabs__list-wrap">
        <div className="tabs__list" ref={listRef} role="tablist">
          {items.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={activeId === item.id}
              className={`tabs__tab${activeId === item.id ? " tabs__tab--active" : ""}`}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {canScrollLeft && (
          <button
            type="button"
            className="tabs__scroll-arrow tabs__scroll-arrow--left"
            onClick={scrollLeft}
            aria-label="前のタブへ"
          >
            ‹
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            className="tabs__scroll-arrow tabs__scroll-arrow--right"
            onClick={scrollRight}
            aria-label="次のタブへ"
          >
            ›
          </button>
        )}
      </div>
      {items.map((item) => (
        <div key={item.id} role="tabpanel" hidden={activeId !== item.id} className="tabs__panel">
          {item.content}
        </div>
      ))}
    </div>
  );
}
