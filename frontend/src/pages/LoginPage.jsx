import { useState } from "react";
import { login } from "../services/auth";

function LoginPage() {
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    login(form.get("login"), form.get("password"))
    .catch(error => {
      setError(error.message);
    });
  };

  return (
    <>
      <h1>Login page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login">Login</label>
          <input name="login" id="login" type="text" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input name="password" id="password" type="password" />
        </div>
        <div>
          <button>Log in</button>
        </div>
        {error && (
          <>
            <div>
              {error}
            </div>
          </>
        )}
      </form>
    </>
  )
}
export default LoginPage;
