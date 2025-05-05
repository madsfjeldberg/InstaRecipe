<script>
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { authService } from "$lib/services/authService";
    import * as Card from "$lib/components/ui/card";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";
    import { z } from "zod";
    import { Stretch } from 'svelte-loading-spinners'; 

    let newPassword = $state("");
    let confirmPassword = $state("");
    let success = $state(false);
    let isLoading = $state(false);

    let isNewPasswordTooShort = $state(false);
    let passwordTooShortErrorMessage = $state("");

    let isConfirmPasswordMatch = $state(true);
    let confirmPasswordErrorMessage = $state("");


    const resetPasswordSchema = z
        .object({
            newPassword: z
                .string()
                .min(8, "Password must be at least 8 characters"),
            confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });



    async function handleResetPassword(event) {
        event.preventDefault();

        const result = resetPasswordSchema.safeParse({
            newPassword,
            confirmPassword,
        });

        const isValid = validateFormInput(result);
        if(!isValid) {
            return;
        }

        await resetPassword();
    }



    async function resetPassword() {
        try {
            isLoading = true;
            const resetToken = getResetTokenFromHref();
            const response = await authService.resetPassword(newPassword, resetToken);

            if (response.status !== 200) {
                console.log("Reset failed:", response.errorMessage);
                toast.error(response.errorMessage || "Something went wrong");
                return;
            }

            toast.success(response.message);
            success = true;
            newPassword = "";
            confirmPassword = "";
            setTimeout(async () => await goto("/login"), 5000); //5 seconds

        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error("An error occurred while resetting password");

        } finally {
            isLoading = false;
        }
    }



    function validateFormInput(result) {

        if (!result.success) {
            if (result.error.issues.length === 2) {
                isNewPasswordTooShort = true;
                passwordTooShortErrorMessage = result.error.issues[0].message;

                isConfirmPasswordMatch = false;
                confirmPasswordErrorMessage = result.error.issues[1].message;
                return false;
            }

            if (result.error.issues[0].message === "Password must be at least 8 characters") {
                isNewPasswordTooShort = true;
                isConfirmPasswordMatch = true;
                passwordTooShortErrorMessage = result.error.issues[0].message;
                return false;

            } else {
                isNewPasswordTooShort = false;
                isConfirmPasswordMatch = false;
                confirmPasswordErrorMessage = result.error.issues[0].message;
                return false;
            }

        } 
        
        isNewPasswordTooShort = false;
        isConfirmPasswordMatch = true;
        return true;
    }


    function getResetTokenFromHref() {
        const pathSegments = location.href.split("/");
        return pathSegments[pathSegments.length - 1];
    }
</script>

<Toaster />

<div class="relative min-h-screen flex flex-col items-center justify-center px-4">
    {#if success}
        <div class="absolute flex flex-col items-center justify-center text-center mb-[27rem]">
            <h1 class="text-2xl font-semibold text-green-600">Password has been reset</h1>
            <h2 class="font-semibold">Redirecting you to login in a few moments</h2>
        </div>
    {/if}

    <Card.Root class="w-full max-w-md p-4 shadow-lg rounded-2x">
        <Card.Header>
            <Card.Title>Reset password</Card.Title>
            <Card.Description
                >Password must be atleast 8 characters.</Card.Description
            >
        </Card.Header>

        <Card.Content>
            <form onsubmit={handleResetPassword} class="flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                    <Label for="newPassword">New password</Label>
                    {#if isNewPasswordTooShort}
                        <p class="text-red-500 text-sm">
                            {passwordTooShortErrorMessage}
                        </p>
                    {/if}
                    <Input
                        bind:value={newPassword}
                        type="password"
                        id="newPassword"
                        placeholder="enter your new password"
                        required
                    />
                </div>

                <div class="flex flex-col gap-1.5">
                    <Label for="confirmPassword">Confirm password</Label>
                    {#if !isConfirmPasswordMatch}
                        <p class="text-red-500 text-sm">
                            {confirmPasswordErrorMessage}
                        </p>
                    {/if}
                    <Input
                        bind:value={confirmPassword}
                        type="password"
                        id="confirmPassword"
                        placeholder="confirm your new password"
                        required
                    />
                </div>

                <Button type="submit">
                    {#if isLoading}
                    <!-- TODO make loading spinners dynamicaly change color based on darkmode or not -->
                        <Stretch size=20 color=#105e7f/>

                        {:else}
                            Reset
                    {/if}
                </Button>
            </form>
        </Card.Content>
    </Card.Root>
</div>
