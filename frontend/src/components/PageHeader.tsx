interface PageHeaderProps {
  title: string;
  description: string;
}

/**
 * Page header component displaying title and description
 */
export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6 shrink-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

