"use client";

import { useState, ReactNode } from "react";

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

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist">
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
      {items.map((item) => (
        <div key={item.id} role="tabpanel" hidden={activeId !== item.id} className="tabs__panel">
          {item.content}
        </div>
      ))}
    </div>
  );
}
