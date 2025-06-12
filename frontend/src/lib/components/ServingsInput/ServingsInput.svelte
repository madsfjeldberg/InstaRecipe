<script>
    import { Minus, Plus } from "lucide-svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    import { toast } from "svelte-sonner";

    let {servings = $bindable()} = $props();

    const checkServingsValue = () => {
        if (servings <= 0) {
            servings = 1;
            toast.error("Servings must be atleast 1");
        }
    };

    const decreaseServings = () => {
        --servings;
        checkServingsValue();
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
        oninput={checkServingsValue}
    />

    <Button
        onclick={() => ++servings}
        variant="outline"
        size="icon"
        class="rounded-l-none h-10 w-10 dark:hover:bg-slate-900"
        aria-label="Increase servings"
    >
        <Plus class="h-4 w-4" />
    </Button>
</div>
