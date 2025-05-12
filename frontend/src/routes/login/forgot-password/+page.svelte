<script>
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { authService } from "$lib/api/authApi";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toast } from "svelte-sonner";
    import { Stretch } from 'svelte-loading-spinners'; 
    
    let email = $state("");
    let isLoading = $state(false);
    let success = $state(false);

    async function handleSendResetPasswordRequest(event) {
        event.preventDefault();

        try {
            isLoading = true;
            const response = await authService.sendRestPasswordRequest(email);
            if (response.status !== 200) {
                toast.error(response.errorMessage);
                return;
            }

            success = true;
            email = "";
            toast.success(response.message);
            console.log("called");
        } catch (error) {
            console.error(error);

        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <title>InstaRecipe | Forgot Password</title>
</svelte:head>

<div class="relative min-h-screen flex flex-col items-center justify-center px-4">
    {#if success}
        <div class="absolute flex flex-col items-center justify-center text-center mb-96">
            <h1 class="text-2xl font-semibold text-green-600">Password Reset Request Sent</h1>
            <h2 class="font-semibold">Please check your email inbox for the reset link.</h2>
        </div>
    {/if}

    <Card.Root class="w-full max-w-md p-4 shadow-lg rounded-2x">
        <Card.Header>
            <Card.Title>Reset password</Card.Title>
            <Card.Description
                >Enter your email address to send reset password request</Card.Description
            >
        </Card.Header>

        <Card.Content>
            <form
                onsubmit={handleSendResetPasswordRequest}
                class="flex flex-col gap-4"
            >
                <div class="flex flex-col gap-1.5">
                    <Label for="email">Email</Label>
                    <Input
                        bind:value={email}
                        type="email"
                        id="email"
                        placeholder="enter your email"
                        required
                    />
                </div>

                <Button type="submit">
                    {#if isLoading}
                        <LoaderCircle class="animate-spin"/>
                    {:else}
                        Submit
                    {/if}
                </Button>
            </form>
        </Card.Content>
    </Card.Root>
</div>
