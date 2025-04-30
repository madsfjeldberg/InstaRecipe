<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { z } from 'zod';
  import { goto } from '$app/navigation';
  import { authService } from '$lib/services/authService.js';
  import { toast } from 'svelte-sonner';
  import { avatarStore } from "$lib/stores/avatarStore.js";

  let props = $props();
  let { toggleAuthMode } = props;

  let errors = $state({
    username: '',
    password: '',
    form: ''
  });

  const LoginRequest = z.object({
    username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long'),
    password: z.string()
    .min(5, 'Password must be at least 5 characters long')
    .max(100, 'Password must be at most 100 characters long'),
  });



  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      let response;
     
      LoginRequest.parse({ username, password });
      response = await authService.login(username, password);
     
      if (response.status === 200) {
        await toast.success('Login successful!');
        // handle avatar
        const data = await response.json(); // Await the JSON response
        console.log('data', data);
        const avatarResponse = await fetch(`http://localhost:9000/users/${data.id}/avatar`, {
          credentials: 'include'
        });
        const avatarBlob = await avatarResponse.blob();
        const reader = new FileReader();
        reader.onload = () => avatarStore.set(reader.result); // This is the base64 image
        reader.readAsDataURL(avatarBlob);
        //redirect to dashboard
        await goto('/dashboard');
      } else {
        errors = { ...errors, form: response.message };
      }
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod errors to form fields
        error.errors.forEach((err) => {
          if (err.path[0] in errors) {
            errors[err.path[0]] = err.message;
          }
        });
      } else {
        errors.form = error.message || 'An unexpected error occurred';
      }
    }
  };

</script>

<Card.Root class="mx-auto max-w-sm mt-60">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description>Enter your email below to login to your account.</Card.Description>
  </Card.Header>
  <Card.Content>
    <form onsubmit={handleSubmit}>
      {#if errors.form}
        <div class="mb-4 text-red-500">{errors.form}</div>
      {/if}
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="username">Username</Label>
        <Input id="username" type="text" placeholder="username" name="username" required />
        {#if errors.username}
          <span class="text-red-500 text-sm">{errors.username}</span>
        {/if}
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="password">Password</Label>
        </div>
        <Input id="password" type="password" placeholder="******" name="password" required />
        {#if errors.password}
          <span class="text-red-500 text-sm">{errors.password}</span>
        {/if}
        <a href="##" class="ml-auto inline-block text-sm underline">
          Forgot your password?
        </a>
      </div>
      <Button type="submit" class="w-full">Login</Button>
    </div>
    <div class="mt-4 text-center text-sm">
      Don&apos;t have an account?
      <Button variant="link" onclick={toggleAuthMode}>Sign up</Button>
    </div>
  </form>
  </Card.Content>
</Card.Root>