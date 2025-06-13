<script>
	import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

	let { labels, data } = $props();

	let canvas;
	let chart; 

	// Register the components for Chart.js once
	Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

	$effect(() => {
		// This code will re-run whenever `labels` or `data` props change.

		// If a chart instance already exists, we update it instead of creating a new one.
		if (chart) {
			chart.data.labels = labels;
			chart.data.datasets[0].data = data;
			chart.update(); // Re-render the chart with new data
		} else {
			// If no chart instance exists, create it for the first time.
			chart = new Chart(canvas, {
				type: 'doughnut',
				data: {
					labels,
					datasets: [
						{
							data,
							backgroundColor: [
								'#60A5FA', // Sky Blue
								'#10B981', // Emerald
								'#FBBF24', // Amber
								'#F87171', // Rose
								'#A78BFA', // Violet
								'#14B8A6', // Teal
								'#FB923C', // Orange
								'#9CA3AF' // Cool Gray
							],
							hoverOffset: 8
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false, // Important for fitting into a sized div
					plugins: {
						legend: {
							display: false // Correctly disable the legend
						}
					}
				}
			});
		}

		// Cleanup function: This will run when the component is unmounted
		// to prevent memory leaks.
		return () => {
			if (chart) {
				chart.destroy();
				chart = undefined; // Clear the instance
			}
		};
	});
</script>

<canvas bind:this={canvas} class="w-full h-full"></canvas>