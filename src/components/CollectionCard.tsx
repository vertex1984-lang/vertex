import { resolveUrl } from '@/lib/paths';

interface CollectionCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

export default function CollectionCard({ title, description, image, href }: CollectionCardProps) {
  return (
    <a
      href={resolveUrl(href)}
      className="group flex flex-col items-center gap-3.5 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg flex-[1_1_100%] max-w-full sm:flex-[1_1_calc(50%-8px)] sm:max-w-[calc(50%-8px)] lg:flex-[1_1_calc(25%-15px)] lg:min-w-[220px] lg:max-w-[320px]"
      style={{
        backgroundColor: '#F8F5F0',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.03)',
      }}
    >
      <div className="w-full aspect-square overflow-hidden rounded-lg">
        <img
          src={resolveUrl(image)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-center flex-1 text-center">
        <h3 className="text-sm font-bold uppercase tracking-wide mb-1">{title}</h3>
        <p className="text-xs text-[#333] mb-3 leading-relaxed flex-1">{description}</p>
        <span
          className="inline-block px-5 py-2 text-xs font-semibold text-white rounded-full transition hover:-translate-y-0.5 mt-auto"
          style={{ backgroundColor: '#8B5A2B' }}
        >
          Explore
        </span>
      </div>
    </a>
  );
}
