import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our story",
  description: "The story behind Atelier — a small, slow studio of considered objects.",
};

const PRINCIPLES = [
  {
    title: "Fewer, better things",
    body: "We reject more than we accept. Every piece in the catalogue is one we would keep in our own home — and use every day.",
  },
  {
    title: "Meet every maker",
    body: "We visit every workshop, see the hands that make the work, and pay prices that allow the maker to keep making.",
  },
  {
    title: "Honest materials",
    body: "Linen, leather, glass, wood, ceramic, brass. Materials that age into something more themselves, not less.",
  },
  {
    title: "Slow commerce",
    body: "No drops, no countdowns, no urgency theatre. The catalogue is small, and it stays small on purpose.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
        Our story
      </p>
      <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
        A small studio
        <br /> with a long view.
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
        Atelier began as a notebook — a list of objects we wished we could
        find. We wanted things made by people we could name, in materials
        that would outlast us. We wanted to pay a fair price and have
        something arrive in the post that felt considered, not transactional.
      </p>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        So we went and found them. A ceramicist in Lisbon. A leather worker
        in Kyoto. A linen weaver outside Riga. We sat in their workshops,
        asked too many questions, and brought the best of what we found
        back to one quiet catalogue.
      </p>

      <div className="mt-20" id="craft">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
          What we believe
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Four principles.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PRINCIPLES.map((principle, i) => (
            <div
              key={principle.title}
              className="rounded-3xl border border-ink/10 bg-card p-6"
            >
              <p className="font-mono text-xs tabular-nums text-muted">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {principle.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-24 grid gap-10 rounded-3xl border border-ink/10 bg-cream p-8 sm:grid-cols-3 sm:p-12"
        id="sustainability"
      >
        <div className="sm:col-span-1">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
            Sustainability
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
            The honest kind.
          </h2>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-ink/80 sm:col-span-2">
          <p id="shipping">
            Every order ships in recycled, plastic-free packaging. We
            offset delivery emissions through verified projects, and we
            consolidate shipments from our makers to reduce the number of
            planes in the air.
          </p>
          <p id="returns">
            We offer a 30-day return window for any piece that doesn&apos;t
            feel right. We also repair what we sell, for as long as the
            maker is making.
          </p>
          <p id="contact">
            For questions, repairs, or to talk to us about a commission,
            write to{" "}
            <a
              href="mailto:hello@atelier.example"
              className="text-ink underline-offset-4 hover:underline"
            >
              hello@atelier.example
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
