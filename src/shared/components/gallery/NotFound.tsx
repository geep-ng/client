import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserNotFound({ username }: { username: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h1 className="text-3xl font-bold text-brown-800">User Not Found</h1>
      <p className="mt-2 text-brown-600">
        We couldn’t find a portfolio for <span className="font-semibold">{username}</span>.
      </p>

      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-brown-700 text-white hover:bg-brown-800 transition"
        >
          Go Home
        </Link>

        <button
          onClick={() => router.refresh()}
          className="px-6 py-3 rounded-xl border border-brown-600 text-brown-700 hover:bg-brown-100 transition"
        >
          Try Again
        </button>

        <Link
          href="/signup"
          className="px-6 py-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition"
        >
          Create Your Portfolio
        </Link>
      </div>
    </div>
  );
}