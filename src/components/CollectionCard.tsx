import { resolveUrl } from '@/lib/paths';

interface CollectionCardProps {
  /** 分类名（如 Cushions），显示为标题上方的眉头小标签 */
  category: string;
  title: string;
  description: string;
  image: string;
  href: string;
  /** 暂缺产品的分类：不可点击，图上打 Coming Soon 徽章 */
  comingSoon?: boolean;
}

export default function CollectionCard({ category, title, description, image, href, comingSoon }: CollectionCardProps) {
  const inner = (
    <>
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
        <img
          src={resolveUrl(image)}
          alt={title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${comingSoon ? '' : 'group-hover:scale-105'}`}
        />
        {comingSoon && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-[#333]/75 text-white text-[11px] font-semibold rounded-full backdrop-blur-sm">
            Coming Soon
          </span>
        )}
      </div>
      <div className="flex flex-col items-center flex-1 text-center">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#8B5A2B] mb-1.5">{category}</p>
        <h3 className="text-base font-bold text-[#333] mb-1">{title}</h3>
        <p className="text-xs text-[#555] mb-3 leading-relaxed flex-1">{description}</p>
        {comingSoon ? (
          <span className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-[#999] border border-[#E8E2DA] rounded-full mt-auto">
            Stay Tuned
          </span>
        ) : (
          <span
            className="group/btn inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-full transition group-hover:-translate-y-0.5 mt-auto"
            style={{ backgroundColor: '#8B5A2B' }}
          >
            Explore
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  const cls = `group flex flex-col items-center gap-3.5 p-4 rounded-2xl transition-all duration-300 w-full h-full ${
    comingSoon ? 'opacity-80 cursor-default' : 'hover:-translate-y-1.5 hover:shadow-xl'
  }`;

  const style = {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    border: '1px solid #EFE9E1',
  };

  if (comingSoon) {
    return <div className={cls} style={style}>{inner}</div>;
  }
  return (
    <a href={resolveUrl(href)} className={cls} style={style}>
      {inner}
    </a>
  );
}
