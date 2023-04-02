<script>
  import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
  import { auth } from '$lib/firebase'

  let email = ''
  let password = ''

  let user = auth.currentUser;
  onAuthStateChanged(auth, (newUser) => {
    console.log('User state changed:', newUser)
    user = newUser;
  });

  async function signIn() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.replace('/');
    } catch (e) {
      console.error(e);
    }
  }

  async function logOut() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  }
</script>

  <div class="container">
    {#if user}
      <div class="user-info">
        <h1>Welcome back {user.displayName}!</h1>
        <p>You are signed in with {user.email}</p>
        <button on:click={logOut}>Sign out</button>
      </div>
    {:else}
      <form on:submit|preventDefault={signIn}>
        <label for="email">Email</label>
        <input id="email" type="email" bind:value={email} />
        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} />
        <button type="submit">Sign in</button>
      </form>
    {/if}
  </div>
<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    width: 300px;
  }

  button {
    width: 300px;
  }
</style>
