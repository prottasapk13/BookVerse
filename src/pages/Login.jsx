function Login() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">

          <div className="card shadow-sm">
            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                Login to BookVerse
              </h2>

              <form>

                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Login
                </button>

              </form>

              <p className="text-center mt-3">
                Don't have an account?{" "}
                <a href="/register">
                  Register
                </a>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;