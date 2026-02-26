"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function LessonPageWrapper({ children }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

