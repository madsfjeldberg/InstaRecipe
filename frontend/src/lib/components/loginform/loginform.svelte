<script>
  import { goto } from '$app/navigation';

  import { z } from 'zod';
  import { toast } from 'svelte-sonner';

  import { LoaderCircle } from 'lucide-svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  import authApi from '$lib/api/authApi.js';
  import userApi from '$lib/api/userApi.js';

  import { updateAuthState } from '../../../stores/authStore.js';

  const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : '/api';

  let { onToggleAuthMode, returnTo } = $props();

  let isLoading = $state(false);

  let errors = $state({
    username: '',
    password: '',
    form: ''
  });

  const LoginRequest = z.object({
    username: z.string()
    .min(1, 'Username can not be empty'),

    password: z.string()
    .min(1, 'Password can not be empty')
  });



  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      isLoading = true;

      errors.form = "";
      errors.username = "";
      errors.password = "";
     
      LoginRequest.parse({ username, password });
      const loggedInUser = await authApi.login(username, password);

      const userAvatarBlob = await userApi.getUserAvatar(loggedInUser.id);
      const reader = new FileReader();
      reader.readAsDataURL(userAvatarBlob);
      reader.onload = () => avatarStore.set(reader.result);

      updateAuthState(loggedInUser);
      
      goto(returnTo);
      toast.success('Login successful!');
      
    } catch (error) {
      
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] in errors) {
            errors[err.path[0]] = err.message;
          }
        });
      } else {
        errors.form = error.message || 'An unexpected error occurred';
      }

    } finally {
      isLoading = false;
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
          {#if errors.username}
            <span class="text-red-500 text-sm">{errors.username}</span>
          {/if}
          <Label for="username">Username</Label>
          <Input id="username" type="text" placeholder="username" name="username"/>
        </div>

        <div class="grid gap-2">
          {#if errors.password}
            <span class="text-red-500 text-sm">{errors.password}</span>
          {/if}
          <Label for="password">Password</Label>
          <Input id="password" type="password" placeholder="******" name="password"/>

          <a href="/login/forgot-password" class="ml-auto inline-block text-sm underline">
            Forgot your password?
          </a>
        </div>

        {#if isLoading}
          <Button disabled><LoaderCircle class="mr-2 h-4 w-4 animate-spin" /> Loading...</Button>
        {:else}
          <Button type="submit" class="w-full">Login</Button>
        {/if}
      </div>
    </form>

    <div class="mt-4 text-center text-sm">
      Don&apos;t have an account?
      <Button variant="link" onclick={onToggleAuthMode}>Sign up</Button>
    </div>
  </Card.Content>
</Card.Root>
