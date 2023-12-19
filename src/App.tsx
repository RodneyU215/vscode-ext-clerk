import React, { useState } from 'react';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
  useSession,
  useClerk,
  useSignIn,
  SignOutButton,
} from '@clerk/clerk-react';

function App() {
  return (
    <>
      <SignedIn>
        <Welcome />
      </SignedIn>
      <SignedOut>
        <SignInPage />
        {/* <RedirectToSignIn /> */}
      </SignedOut>
    </>
  );
}

function SignInPage() {
  const clerk = useClerk();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  async function submit(e: any) {
    e.preventDefault();
    signIn
      ?.create({
        identifier: email,
        password,
      })
      .then((result) => {
        if (result.status === 'complete') {
          console.log(result);
          setActive({ session: result.createdSessionId });
        } else {
          console.log(result);
        }
      })
      .catch((err) =>
        console.error('error', err.errors[0].longMessage)
      );
  }

  return (
    <>
      <h1>Sign in</h1>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button>Sign in</button>
        </div>
      </form>
    </>
  );
}

function Welcome() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { session } = useSession();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <>
      <div>Hello {user.firstName}, welcome to Clerk!</div>
      <UserButton afterSignOutUrl="/" />
      <p>
        This session has been active since{' '}
        {session?.lastActiveAt.toLocaleString()}
      </p>
      <SignOutButton />
    </>
  );
}

export default App;
