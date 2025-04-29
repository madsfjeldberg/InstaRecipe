<script>
  import { ThumbsUp, ThumbsDown } from "lucide-svelte";

  let thumbsUp = 10;
  let thumbsDown = 5;

  const calculatePopularity = (up, down) => {
    let score = up - down;
    let color;

    if (score > 0) {
      color = "text-green-700";
    } else if (score < 0) {
      color = "text-red-700";
    } else {
      color = "text-gray-500";
    }

    return `<span class="${color} font-semibold">${score}</span>`;
  };

  let popularityScore = calculatePopularity(thumbsUp, thumbsDown);
</script>

<div class="flex items-center gap-2">
  <button class="opacity-0 group-hover:opacity-100 duration-200 transition-all flex items-center gap-1 hover:text-green-700">
    <ThumbsUp class="h-5 w-5" />
  </button>
  {@html popularityScore}
  <button class="opacity-0 group-hover:opacity-100 duration-200 transition-all flex items-center gap-1 hover:text-red-700">
    <ThumbsDown class="h-5 w-5" />
  </button>
</div>
