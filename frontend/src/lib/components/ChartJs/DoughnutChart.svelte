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
        datasets: [
          {
            data,
            backgroundColor: ["#f87171", "#60a5fa", "#facc15"],
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
