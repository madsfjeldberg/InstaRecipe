<script>
  import { onMount } from "svelte";
  import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  } from "chart.js";

  let canvas;
  let chart;

  const { ingredients } = $props();

  Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  );

  $effect(() => {
    if (chart) {
			chart.data.datasets[0].data = ingredients;
			chart.update(); // Re-render the chart with new data
      
    } else {
      chart = new Chart(canvas, {
        type: "bar",
        data: {
          labels: ingredients.map((i) => i.name),
          datasets: [
            {
              label: "Protein",
              data: ingredients.map((i) => i.protein),
              backgroundColor: "#60a5fa", // Blue
            },
            {
              label: "Fat",
              data: ingredients.map((i) => i.fat),
              backgroundColor: "#f472b6", // Pink
            },
            {
              label: "Carbs",
              data: ingredients.map((i) => i.carbs),
              backgroundColor: "#4ade80", // Green
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: { stacked: false },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Grams",
              },
            },
          },
        },
      });
    }

    return () => {
      if (chart) {
				chart.destroy();
				chart = undefined; // Clear the instance
			}
    };
  });
</script>

<div class="max-w-screen h-full">
  <canvas bind:this={canvas}></canvas>
</div>
