<script>
  // import { Section, Register } from 'flowbite-svelte-blocks';
  // import { Button, Checkbox, Input, Label } from 'flowbite-svelte';
  import { z } from 'zod';

  const ChangeUsernameRequest = z.object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters long')
      .max(20, 'Username must be at most 20 characters long'),
  });
  
  const ChangePasswordRequest = z.object({
    password: z.string()
      .min(5, 'Password must be at least 5 characters long')
      .max(100, 'Password must be at most 100 characters long'),
    confirmPassword: z.string()
      .min(5, 'Confirm password must be at least 5 characters long')
      .max(100, 'Confirm password must be at most 100 characters long'),
  });

  const handleChangeUsername = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get('username');

    try {
      ChangeUsernameRequest.parse({ username });
      // Call the API to change the username
      console.log('Username changed to:', username);
      // Add API call here
      
    } catch (error) {
      console.error('Error changing username:', error);
    }
  };

  const handlePlaceholder = () => {
    toast.error('Feature not implemented yet. Coming soon!');
  }

  export let data;

  const { user } = data;
  let username = user.username;

  function updateUsername() {
    // Logic to handle username update
    console.log('Username updated to:', username);
  }
</script>

<h1 class="font-bold text-3xl text-center dark:text-gray-200">Settings</h1>

<div class="flex flex-row"> 

<!-- <Register>
	<div class="flex justify-center space-y-4 p-6 sm:p-8 md:space-y-6">
		<form class="flex flex-col space-y-6" onsubmit={handlePlaceholder}>
		  <h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Change username</h3>
			<Label class="space-y-2">
				<span>New username</span>
				<Input type="text" name="username" placeholder="Enter new username" required bind:value={username} />
			</Label>
			<Button type="submit" class="w-full cursor-pointer">Change username</Button>
		</form>
	</div>
</Register>

<Register>
	<div class="flex justify-center space-y-4 p-6 sm:p-8 md:space-y-6">
		<form class="flex flex-col space-y-6"onsubmit={handlePlaceholder}>
		  <h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Change password</h3>
			<Label class="space-y-2">
				<span>New password</span>
				<Input type="password" name="password" placeholder="Enter new password" required />
			</Label>
      <Label class="space-y-2">
        <span>Confirm new password</span>
        <Input type="password" name="confirmPassword" placeholder="Confirm new password" required />
      </Label>
			<Button type="submit" class="w-full cursor-pointer">Change password</Button>
		</form>
	</div>
</Register> -->

</div>