import { useState } from "react";
import { register } from "../services/auth";

function RegisterPage() {
  const [info, setInfo] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    if (form.get("password") !== form.get("repeat-password")) {
      setInfo("Passwords do not match");
      return;
    }
    register(form.get("username"), form.get("email"), form.get("password"))
    .then(() => {
      setInfo("Account created successfully");
    })
    .catch(error => {
      setInfo(error.message);
    })
  };

  return (
    <>
      <h1>Register page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input name="username" id="username" type="text" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input name="email" id="email" type="text" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input name="password" id="password" type="password" />
        </div>
        <div>
          <label htmlFor="repeat-password">Repeat Password</label>
          <input name="repeat-password" id="repeat-password" type="password" />
        </div>
        <div>
          <button>Register</button>
        </div>
        {info && (
          <>
            <div>
              {info}
            </div>
          </>
        )}
      </form>
    </>
  )
}
export default RegisterPage;
