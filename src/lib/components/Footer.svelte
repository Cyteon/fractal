<script lang="ts">
    import { Mail } from "@lucide/svelte";
</script>

<footer class="p-2 px-3 flex w-full border-t border-black/40 mt-auto">
    <p>The email service you have dreamed of</p>

    <div class="ml-auto flex">
        <a
            href="mailto:fractal@cyteon.dev"
            class="flex items-center"
        >
            <Mail class="mr-1 text-text hover:text-blue" />
        </a>
    </div>
</footer>