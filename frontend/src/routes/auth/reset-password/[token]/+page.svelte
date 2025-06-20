<script>
    import { goto } from "$app/navigation";

    import { z } from "zod";

    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card";
    import { toast } from "svelte-sonner";
    import { Stretch } from 'svelte-loading-spinners'; 
    import { LoaderCircle } from "lucide-svelte";

    import authApi from "$lib/api/authApi";

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



    const handleResetPassword = async (event) => {
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



    const resetPassword = async () => {
        try {
            isLoading = true;
            const resetToken = getResetTokenFromHref();
            await authApi.resetPassword(newPassword, resetToken);

            success = true;
            newPassword = "";
            confirmPassword = "";
            toast.success("Password has been reset.");
            setTimeout(async () => await goto("/auth/login"), 5000); //5 seconds

        } catch (error) {
            console.error("Unexpected error:", error);
            toast.error(error.message);

        } finally {
            isLoading = false;
        }
    }



    const validateFormInput = (result) => {

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


    const getResetTokenFromHref = () => {
        const pathSegments = location.href.split("/");
        return pathSegments[pathSegments.length - 1];
    }
</script>

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

                {#if isLoading}
                    <Button disabled>
                        <LoaderCircle class="animate-spin"/>
                    </Button>
                {:else}
                    <Button type="submit">
                        Reset
                    </Button> 
                {/if}
            </form>
        </Card.Content>
    </Card.Root>
</div>
