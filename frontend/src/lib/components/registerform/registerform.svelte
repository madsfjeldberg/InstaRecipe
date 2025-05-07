<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { z } from 'zod';
  import { goto } from '$app/navigation';
  import { authService } from '$lib/services/authService.js';
  import { toast } from 'svelte-sonner';

  let { onToggleAuthMode } = $props();
  let loading = $state(false);
  let errors = $state({
    username: '',
    password: '',
    email: '',
    form: ''
  });

  const RegisterRequest = z.object({
    username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long'),
    password: z.string()
    .min(5, 'Password must be at least 5 characters long')
    .max(100, 'Password must be at most 100 characters long'),
    email: z.string()
    .email('Invalid email address')
    .max(50, 'Email must be at most 50 characters long'),
  });

  const handleSubmit = async (event) => {
    console.log('handleSubmit');
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      let response;
      
      loading = true; // Set loading to true when the request starts
      //TODO ADD A LOADING SPINNER
      RegisterRequest.parse({ username, email, password});
      response = await authService.register(username, email, password);
      console.log("REGISTER RESPONSE", response)
      
      if (response.status === 200) {
        await toast.success('Registration email sent!');
        loading = false;
        await goto('/verify');
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
        loading = false;
      } else {
        errors.form = error.message || 'An unexpected error occurred';
        loading = false;
      }
    }
  };

</script>

<Card.Root class="mx-auto max-w-sm mt-60">
  <Card.Header>
    <Card.Title class="text-xl">Sign Up</Card.Title>
    <Card.Description>Enter your information to create an account.</Card.Description>
  </Card.Header>
  <Card.Content>
    <form onsubmit={handleSubmit}>
      {#if errors.form}
        <span class="text-red-500 text-sm">{errors.form}</span>
      {/if}
    <div class="grid gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="grid col-span-4 gap-2">
          <Label for="username">Username</Label>
          <Input id="username" placeholder="username" name="username" required />
          {#if errors.username}
          <span class="text-red-500 text-sm">{errors.username}</span>
        {/if}
        </div>
      </div>
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="user@example.com" name="email" required />
        {#if errors.email}
          <span class="text-red-500 text-sm">{errors.email}</span>
        {/if}
      </div>
      <div class="grid gap-2">
        <Label for="password">Password</Label>
        <Input id="password" type="password" placeholder="******" name="password" required />
        {#if errors.password}
          <span class="text-red-500 text-sm">{errors.password}</span>
        {/if}
      </div>
      {#if loading}
        <Button disabled><LoaderCircle class="mr-2 h-4 w-4 animate-spin" /> Loading...</Button>
      {:else}
        <Button type="submit" class="w-full">Sign Up</Button>
      {/if}
    </div>
    <div class="mt-4 text-center text-sm">
      Already have an account?
      <Button variant="link" onclick={onToggleAuthMode}> Sign in </Button>
    </div>
  </Card.Content>
</Card.Root>
