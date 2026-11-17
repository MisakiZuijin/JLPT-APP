import { Suspense } from "react";
import Link from "next/link";
import { getQueue } from "./actions";
import ReviewSession from "./ReviewSession";

export default function ReviewPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:underline">← Dashboard</Link>
      <h1 className="mt-2 text-2xl font-bold">Review SRS</h1>
      <Suspense fallback={<p className="mt-10 text-center text-slate-500">Menyiapkan kartu...</p>}>
        <ReviewLoader />
      </Suspense>
    </main>
  );
}

async function ReviewLoader() {
  const queue = await getQueue();
  return <ReviewSession initialQueue={queue} />;
}
