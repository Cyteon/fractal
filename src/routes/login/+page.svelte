<script lang="ts">
    import { goto } from "$app/navigation";
    import { setCookie } from "typescript-cookie";

    let email: string = "";
    let password: string = "";
    let error: string = "";

    async function login() {
        error = "";

        if (!email || !password) {
            error = "Invalid email or password.";
            return;
        }

        if (password.length < 8) {
            error = "Invalid email or password.";
            return;
        }

        try {
            const res = await fetch("/api/v1/auth/login", {
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

            if (res.status === 200) {
                setCookie("token", data.token, {
                    expires: 28,
                });

                goto("/dash");
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
    <div class="p-4 m-auto w-full md:w-1/4 flex flex-col bg-base rounded-md border border-black/40">
        <h1 class="text-2xl font-bold mb-4">Log into your Account</h1>

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
            on:click={login}
        >
            Login
        </button>

        <p class="text-sm mt-3 font-semibold">
            Don't have an account? <a href="/register">Register</a>
        </p>
    </div>
</div>  