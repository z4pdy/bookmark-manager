import { useState } from "react";
import { register } from "../services/auth";

function RegisterPage() {
  const [info, setInfo] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    if (form.get("password") !== form.get("repeat-password")) {
      setInfo("Passwords do not match");
      setSuccess(false);
      return;
    }
    register(form.get("username"), form.get("email"), form.get("password"))
    .then(() => {
      setInfo("Account created successfully");
      setSuccess(true);
    })
    .catch(error => {
      setInfo(error.message);
    })
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-100 bg-dark">
      <div className="card bg-dark border-secondary-subtle shadow-sm" style={{ width: "100%", maxWidth: "380px" }}>
        <div className="card-body p-4">
          <h1 className="h4 fw-semibold mb-4">Register page</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label small text-secondary">Username</label>
              <input name="username" id="username" type="text" className="form-control" required/>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label small text-secondary">Email</label>
              <input name="email" id="email" type="text" className="form-control" required/>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label small text-secondary">Password</label>
              <input name="password" id="password" type="password" className="form-control" required/>
            </div>
            <div className="mb-3">
              <label htmlFor="repeat-password" className="form-label small text-secondary">Repeat Password</label>
              <input name="repeat-password" id="repeat-password" type="password" className="form-control" required/>
            </div>
            <div className="d-grid mt-4">
              <button className="btn btn-primary">Register</button>
            </div>
            {info && (
              <div className={`alert ${success ? "alert-success" : "alert-danger"} mt-3 py-2 small mb-0`}>
                {info}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
export default RegisterPage;
