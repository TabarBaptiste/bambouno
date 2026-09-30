import { menu } from "@/data/menu";
import { CategoryBar } from "@/components/CategoryBar";
import { MenuItemCard } from "@/components/MenuItemCard";
import { SectionTitle } from "@/components/SectionTitle";

/** La carte : barre de rubriques collée, puis une section par rubrique. */
export function MenuBrowser() {
  return (
    <div>
      <CategoryBar categories={menu} />

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-10">
        {menu.map((category) => (
          <section
            key={category.id}
            id={category.id}
            aria-labelledby={`${category.id}-titre`}
            tabIndex={-1}
            className="outline-none"
          >
            <div className="flex items-end justify-between gap-4">
              <SectionTitle
                id={`${category.id}-titre`}
                level={3}
                prefix={category.titlePrefix}
                accent={category.titleAccent}
              />
              <p className="shrink-0 pb-1 text-sm text-muted">
                {category.items.length} {category.unit}
              </p>
            </div>
            {category.subtitle ? (
              <p className="mt-3 text-sm text-muted">{category.subtitle}</p>
            ) : null}
            <ul className="mt-2 divide-y divide-hairline">
              {category.items.map((item) => (
                <MenuItemCard key={item.id} item={item} visual={category.visual} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
