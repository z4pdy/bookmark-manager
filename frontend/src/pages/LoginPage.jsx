import { useState, useEffect } from "react";
import { getUser, login, isLoggedIn } from "../services/auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn()) {
      navigate(`/u/${getUser().username}`);
    }
  }, [navigate]);


  function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    login(form.get("login"), form.get("password"))
    .then(() => {
      window.location.href = `/u/${getUser().username}`;
    })
    .catch(error => {
      setError(error.message);
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-100 bg-dark">
      <div className="card bg-dark border-secondary-subtle shadow-sm" style={{ width: "100%", maxWidth: "380px" }}>
        <div className="card-body p-4">
          <h1 className="h4 fw-semibold mb-4">Login page</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="login" className="form-label small text-secondary">Login</label>
              <input name="login" id="login" type="text" className="form-control" required/>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label small text-secondary">Password</label>
              <input name="password" id="password" type="password" className="form-control" required/>
            </div>
            <div className="d-grid mt-4">
              <button className="btn btn-primary">Log in</button>
            </div>
            {error && (
              <div className="alert alert-danger mt-3 py-2 small mb-0">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>    
  )
}
export default LoginPage;
