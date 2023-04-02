<script lang="ts">
  import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

  import { auth, trackError } from '$lib/firebase';

  import GoogleIcon from './GoogleIcon.svelte';

  const provider = new GoogleAuthProvider();

  export let message = 'Sign in to start generating your meals!';
  let user = auth.currentUser;

  function login() {
    signInWithPopup(auth, provider)
      .then((result) => {
        user = result.user;
      }).catch((error) => {
        trackError(error, 'login_error');
      });
  }
</script>


<h2>{message}</h2>
<button
  class="sign-in"
  on:click={login}
>
  <div class="google-icon">
    <GoogleIcon --size="18px"/>
  </div>
  <p>Sign in with Google</p>
</button>


<style>
  .sign-in {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1em 0;
    padding: 1px 12px;
    width: auto;
    height: 40px;
    border-radius: 4px;
    background-color: #fff;
    color: #3c4043;
    font-size: 14px;
  }

  .google-icon {
    margin-right: 8px;
  }
</style>