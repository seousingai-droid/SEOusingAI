import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h-lg mt-5">This page is not in the index.</h1>
      <p className="lede mx-auto mt-5 max-w-md">The link may be old or mistyped. The guides are a good place to pick things back up.</p>
      <div className="mt-9 flex justify-center gap-3"><Link className="btn btn-primary" href="/guides">Browse guides</Link><Link className="btn btn-ghost" href="/">Go home</Link></div>
    </section>
  );
}
