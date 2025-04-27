<script>

  let props = $props();
  let { toggleAuthMode } = props;

  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { z } from 'zod';
  import { goto } from '$app/navigation';

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
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      let response;
      
      RegisterRequest.parse({ username, email, password});
      response = await auth.register(username, email, password);
      console.log(response)
      
      if (response.status === 200) {
        await toast.success('Registration successful!');
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
      } else {
        errors.form = error.message || 'An unexpected error occurred';
      }
    }
  };

</script>

<Card.Root class="mx-auto max-w-sm mt-60">
  <Card.Header>
    <Card.Title class="text-xl">Sign Up</Card.Title>
    <Card.Description>Enter your information to create an account</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="grid col-span-4 gap-2">
          <Label for="first-name">Username</Label>
          <Input id="first-name" placeholder="Max" required />
        </div>
        <!-- <div class="grid gap-2">
          <Label for="last-name">Last name</Label>
          <Input id="last-name" placeholder="Robinson" required />
        </div> -->
      </div>
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="user@example.com" required />
      </div>
      <div class="grid gap-2">
        <Label for="password">Password</Label>
        <Input id="password" type="password" placeholder="******" required />
      </div>
      <Button onclick={handleSubmit} type="submit" class="w-full">Create an account</Button>
    </div>
    <div class="mt-4 text-center text-sm">
      Already have an account?
      <Button variant="link" onclick={toggleAuthMode}> Sign in </Button>
    </div>
  </Card.Content>
</Card.Root>
