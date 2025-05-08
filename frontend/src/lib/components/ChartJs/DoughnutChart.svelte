<script>
  import { onMount } from "svelte";
  import {
    Chart,
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend,
  } from "chart.js";

  let canvas;

  const { labels, data } = $props();

  onMount(() => {
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

    new Chart(canvas, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
            data,
            backgroundColor: [
              '#60A5FA', // Sky Blue
              '#10B981', // Emerald
              '#FBBF24', // Amber
              '#F87171', // Rose
              '#A78BFA', // Violet
              '#14B8A6', // Teal
              '#FB923C', // Orange
              '#9CA3AF'  // Cool Gray
            ],
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  });
</script>

<canvas bind:this={canvas} class="w-full h-full"></canvas>
