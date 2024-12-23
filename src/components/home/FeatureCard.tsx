import Link from 'next/link';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export const FeatureCard = ({ icon, title, description, href }: FeatureCardProps) => {
  return (
    <Link 
      href={href}
      className="group block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-4xl mb-4" aria-hidden="true">{icon}</div>
      <h2 className="text-xl font-semibold text-dark group-hover:text-primary transition-colors">
        {title}
      </h2>
      <p className="mt-2 text-gray-600">{description}</p>
    </Link>
  );
};