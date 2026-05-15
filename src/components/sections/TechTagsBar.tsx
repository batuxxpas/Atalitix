"use client";

interface TechTag {
  name: string;
}

interface TechTagsBarProps {
  tags: TechTag[];
}

export function TechTagsBar({ tags }: TechTagsBarProps) {
  return (
    <section className="py-8 bg-white border-y border-slate-200">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {tags.map((tag, idx) => (
            <span
              key={tag.name}
              className="tag-pill animate-scale-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
