<script>
  import Separator from "../separator/separator.svelte";
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <Separator />
  <div class="container mx-auto px-4 py-4">
    <div class="flex flex-col items-center space-y-2">
      <nav class="flex flex-wrap justify-center gap-x-8 gap-y-4">
        <a 
          href="/about" 
          class="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          About
        </a>
        <a 
          href="/contact" 
          class="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Contact
        </a>
        <a 
          href="/privacy" 
          class="text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Privacy Policy
        </a>
      </nav>
      
      <p class="text-sm text-muted-foreground">
        &copy; {currentYear} madsfjeldberg / chrisye0001. All rights reserved.
      </p>
    </div>
  </div>
</footer>