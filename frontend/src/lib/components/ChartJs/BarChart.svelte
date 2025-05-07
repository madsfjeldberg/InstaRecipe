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

  const { ingredients } = $props();

  onMount(() => {
    Chart.register(
      BarController,
      BarElement,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
    );

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: ingredients.map((i) => i.name),
        datasets: [
          {
            label: "Protein (g)",
            data: ingredients.map((i) => i.protein),
            backgroundColor: "#4ade80", // Green
          },
          {
            label: "Fat (g)",
            data: ingredients.map((i) => i.fat),
            backgroundColor: "#facc15", // Yellow
          },
          {
            label: "Carbs (g)",
            data: ingredients.map((i) => i.carbs),
            backgroundColor: "#60a5fa", // Blue
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
  });
</script>

<div class="max-w-screen h-full">
  <canvas bind:this={canvas}></canvas>
</div>
