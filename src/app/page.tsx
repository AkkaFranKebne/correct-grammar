import GrammarChecker from "@/components/GrammarChecker";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Grammar and Orthography Checker
      </h1>
      <ErrorBoundary>
        <GrammarChecker />
      </ErrorBoundary>
    </main>
  );
}
