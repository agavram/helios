import { createSignal } from "solid-js";

export interface RetryCardProps {
  onRetry: () => void;
}

export default function RetryCard({ onRetry }: RetryCardProps) {
  // Spin status
  const [isSpinning, setIsSpinning] = createSignal(false);

  return (
    <div class="flex-wrap items-center cursor-pointer inline-flex text-gray-300 hover:text-gray-500"
      onClick={() => {
        if (isSpinning()) return;

        setIsSpinning(true);
        onRetry();
        setTimeout(() => {
          setIsSpinning(false);
        }, 700);
      }}>
      <h4 class="p-1 mr-2">Failed to load. Retry?</h4>
      <svg class={"h-5 duration-700 " + (isSpinning() ? "animate-[spin_650ms_ease-in-out]" : "")} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.188-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20Z" />
      </svg>
    </div>
  );
}
