import Card from "./Card";

export default function LoadingCard() {
  return (
    <Card>
      <div class="animate-pulse">
        <div class="rounded-lg bg-gray-800 h-4 w-4/12"></div>
        <div class="rounded-lg bg-gray-800 h-4 w-full mt-3"></div>
        <div class="rounded-lg bg-gray-800 h-4 w-8/12 mt-3"></div>
      </div>
    </Card>
  );
}
