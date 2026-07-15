import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Blocks,
  Code2,
  Palette,
  Share2,
} from "lucide-react";
import { Button } from "../ui/button";

const features = [
  {
    icon: Blocks,
    title: "Drag-and-drop builder",
    description:
      "Build forms block by block — questions, statements, and more — with instant preview as you go.",
  },
  {
    icon: Palette,
    title: "Beautiful themes",
    description:
      "Pick from a set of ready-made color palettes so every form looks intentional, not default.",
  },
  {
    icon: Share2,
    title: "Publish and embed",
    description:
      "Share a public link or embed your form directly on any site — no extra setup required.",
  },
  {
    icon: BarChart3,
    title: "Track responses",
    description:
      "See every response roll in and keep tabs on how each form is performing, all in one place.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <span className="text-lg font-semibold text-gray-950">Formly</span>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </nav>
      </header>

      <main>
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-16 pb-20 text-center sm:px-6 lg:px-8">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            Build and publish beautiful forms, without the busywork
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-500">
            Formly is a simple form builder for questions, surveys, and
            sign-ups — build it, theme it, share it, and watch responses come
            in.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get started for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-950">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <Code2 className="h-8 w-8 text-gray-700" />
            <h2 className="text-2xl font-semibold text-gray-950">
              Ready to build your first form?
            </h2>
            <p className="max-w-md text-sm text-gray-500">
              It only takes a minute to create an account and start building —
              no credit card required.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">
                Get started for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 py-8 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
        Formly — build and publish beautiful forms.
      </footer>
    </div>
  );
}
