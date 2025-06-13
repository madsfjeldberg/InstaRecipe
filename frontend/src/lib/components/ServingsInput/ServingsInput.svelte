<script>
	import { Minus, Plus } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';

	let { servings = $bindable(), handleAdjustRecipeMacros } = $props();
	const onAdjustRecipeMacros = handleAdjustRecipeMacros;


	$effect(() => {
		if (servings === null || servings === undefined || servings <= 0) {
			return;
		}

		onAdjustRecipeMacros();
	});

	const validateAndCorrectInput = () => {
		if (servings <= 0 || servings === null || servings === undefined) {
			toast.error("Servings must be at least above 0");
			servings = 1;
		}
	};

	const decreaseServings = () => {
		if (servings > 1) {
			servings--;
            return;
		}
        toast.error("Servings must be at least above 0")
	};
</script>

<div class="flex items-center gap-3">
	<Button
		onclick={decreaseServings}
		variant="outline"
		size="icon"
		class="rounded-r-none h-10 w-10 dark:hover:bg-slate-900"
		aria-label="Decrease servings"
	>
		<Minus class="h-4 w-4" />
	</Button>

	<Input
		class="w-20 font-semibold text-center pl-7"
		bind:value={servings}
		type="number"
		min="1"
		aria-label="Servings amount"
		onchange={validateAndCorrectInput}
	/>

	<Button
		onclick={() => servings++}
		variant="outline"
		size="icon"
		class="rounded-l-none h-10 w-10 dark:hover:bg-slate-900"
		aria-label="Increase servings"
	>
		<Plus class="h-4 w-4" />
	</Button>
</div>