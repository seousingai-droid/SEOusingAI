import Link from "next/link";
import { CallButtons } from "@/components/site";

export default function NotFound() {
  return (
    <section className="wrap py-24">
      <p className="label text-copper">Page not found</p>
      <h1 className="display h-xl mt-4">This page is not here.</h1>
      <p className="mt-5 max-w-[50ch] text-[1.1rem] text-muted">It may have moved. Go to the <Link href="/" className="link">home page</Link>, see our <Link href="/services" className="link">services</Link>, or call us if your AC needs help now.</p>
      <div className="mt-8"><CallButtons /></div>
    </section>
  );
}
