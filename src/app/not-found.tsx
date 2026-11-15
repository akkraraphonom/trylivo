import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm text-muted">404</p>
      <h1 className="h-section mt-3">Page not found</h1>
      <p className="mt-3 max-w-sm text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-dark">
          Back home
        </Link>
        <Link href="/shop/collection/all" className="btn-outline">
          Shop all
        </Link>
      </div>
    </section>
  );
}
