import Link from "next/link";
import type { ReactNode } from "react";

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
};

type Product = {
  name: string;
  price: string;
};

type Category = {
  name: string;
};

function IconTruck(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M3 6h11v11H3V6Zm11 4h4l3 3v4h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function IconHeadphones(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M4 13a8 8 0 0 1 16 0v6a2 2 0 0 1-2 2h-1v-7h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 14h3v7H6a2 2 0 0 1-2-2v-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconRotate(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M20 12a8 8 0 1 1-2.34-5.66"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M20 4v6h-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLock(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={props.className}
    >
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6 11h12v10H6V11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionHeading(props: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="min-w-0">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {props.title}
        </h2>
        {props.subtitle ? (
          <p className="mt-2 text-sm sm:text-base text-[var(--muted)]">
            {props.subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] overflow-hidden shadow-sm">
      <div className="aspect-[16/9] bg-[var(--secondary)] flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="w-10 h-10 text-black/30 dark:text-white/30"
        >
          <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8 14l2-2 3 3 2-2 3 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="p-4">
        <div className="font-semibold">{product.name}</div>
        <div className="mt-1 text-sm text-[var(--muted)]">{product.price}</div>
        <button
          type="button"
          className="mt-3 text-sm font-medium hover:underline underline-offset-4"
        >
          Add to Cart →
        </button>
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <button
      type="button"
      className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] overflow-hidden shadow-sm text-left"
    >
      <div className="aspect-[16/10] bg-[var(--secondary)] flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="w-10 h-10 text-black/30 dark:text-white/30"
        >
          <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8 14l2-2 3 3 2-2 3 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="p-4 flex items-center justify-start">
        <span className="rounded-full bg-black text-white dark:bg-white dark:text-black px-4 py-1 text-sm font-medium group-hover:opacity-90 transition">
          {category.name}
        </span>
      </div>
    </button>
  );
}

export default function HomeLanding() {
  const features: Feature[] = [
    {
      title: "Free Shipping",
      description: "Quick, reliable delivery on every order.",
      icon: <IconTruck className="w-6 h-6" />,
    },
    {
      title: "24/7 Support",
      description: "We’re here whenever you need help.",
      icon: <IconHeadphones className="w-6 h-6" />,
    },
    {
      title: "Easy Returns",
      description: "Simple returns with clear status updates.",
      icon: <IconRotate className="w-6 h-6" />,
    },
    {
      title: "Secure Checkout",
      description: "Your data stays protected end-to-end.",
      icon: <IconLock className="w-6 h-6" />,
    },
  ];

  const products: Product[] = [
    { name: "Short-Sleeved Shirts", price: "$ 890.98 USD" },
    { name: "Short-Sleeved Shirts", price: "$ 890.98 USD" },
    { name: "Short-Sleeved Shirts", price: "$ 890.98 USD" },
  ];

  const categories: Category[] = [
    { name: "Men" },
    { name: "Women" },
    { name: "Kids" },
    { name: "Accessories" },
  ];

  return (
    <div className="w-full">
      <section className="mx-auto w-full max-w-7xl">
        <div
          className="rounded-3xl  border border-[var(--border)] bg-[var(--secondary)] overflow-hidden shadow-sm"
          // style={{
          //   backgroundImage:
          //     "linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.78)), url('/bg.jpg')",
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          //   backgroundRepeat: "no-repeat",
          // }}
        >
          <div className="px-4  sm:px-16 py-10 sm:py-32 text-center">
            <div className="mx-auto max-w-2xl">
              <p className="text-xs tracking-widest uppercase text-[var(--muted)]">
                Pirate - Polls
              </p>
              <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">
                True Anonymous Polls
              </h1>
              <p className="mt-4 text-sm sm:text-base text-[var(--muted)]">
                Modern and stylish polls, built with a clean layout and a fast
                experience. Create, share, and discover what people really
                think—anonymously.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <Link
                  href="/anonymous-polls"
                  className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center"
                >
                  Try Anonymous Poll
                </Link>
                <Link
                  href="/create-poll"
                  className="btn btn-secondary border border-[var(--border)] w-full sm:w-auto inline-flex items-center justify-center"
                >
                  Create Normal Poll
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--background)] flex items-center justify-center text-[var(--foreground)]">
                {f.icon}
              </div>
              <div className="min-w-0">
                <div className="font-semibold">{f.title}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">
                  {f.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
