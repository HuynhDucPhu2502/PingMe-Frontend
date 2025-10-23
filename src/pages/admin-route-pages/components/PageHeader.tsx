import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && <p className="text-purple-100 mt-1">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}
