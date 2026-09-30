import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><div><span>404</span><h1>This page could not be found.</h1><p>The link may have moved, or the page may not exist yet.</p><Link className="btn btn-primary" href="/en">Back to GharChamak</Link></div></main>;
}
