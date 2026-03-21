"use client";

import dynamic from "next/dynamic";

const ToasterWithBackdrop = dynamic(() => import("./ToasterWithBackdrop"), {
  ssr: false,
});

export default ToasterWithBackdrop;
