<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_DISABLE_SIGNUPS } from "$env/static/public"

    let email: string = "";
    let password: string = "";
    let error: string = "";

    async function register() {
        error = "";

        if (!email || !password) {
            error = "Please fill in all fields.";
            return;
        }

        if (password.length < 8) {
            error = "Password must be at least 8 characters long.";
            return;
        }

        try {
            const res = await fetch("/api/v1/auth/register", {
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (res.status === 201) {
                goto("/login");
            } else {
                error = data.error;

                if (!error) { // just incase smth wrong with the json
                    error = "An unexpected error occurred.";
                }
            }

        } catch (err) {
            console.error(err);
            error = "An error occurred. Please try again.";
            return;
        }
    }
</script>

<div class="flex h-full">
    {#if PUBLIC_DISABLE_SIGNUPS === "true"}  
        <h1 class="text-3xl font-bold m-auto text-center bg-base p-4 rounded-md border">
            Signups are currently disabled.
        </h1>
    {:else}
        <div class="p-4 m-auto w-full md:w-1/4 flex flex-col bg-base rounded-md border border-black/40">
            <h1 class="text-2xl font-bold mb-4">Create an Account</h1>

            <input
                type="email"
                bind:value={email}
                placeholder="Email"
                class="mb-2"
            />

            <input
                type="password"
                bind:value={password}
                placeholder="Password"
            />

            <p class="text-red text-sm mt-2 font-semibold">
                {error}
            </p>

            <button
                class="mt-2 bg-brown text-white font-semibold text-lg p-2 rounded-md"
                on:click={register}
            >
                Register
            </button>
        </div>
    {/if}
</div>  