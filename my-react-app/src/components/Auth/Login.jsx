import "./Login.css"; // Asegúrate de importar tu archivo CSS personalizado

const Login = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="flex w-full max-w-4xl bg-white rounded-md shadow-lg">
        <div className="hidden md:flex md:w-1/2 bg-teal-700 text-white flex-col items-center justify-center p-10">
          <h1 className="text-3xl font-bold">Bienvenido a Gloove</h1>
          <p className="mt-3 text-lg text-center">
            Gestiona tus alojamientos turísticos con facilidad y eficiencia.
          </p>
        </div>
        <div className="w-full p-8 md:w-1/2 flex flex-col items-center">
          <img src="Logo-Gloove.webp" alt="Gloove Logo" className="mb-5 w-32" />
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Sign In
          </h2>
          <form className="mt-6 space-y-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="hello@gloove.me"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="************"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-teal-700 rounded-md hover:bg-teal-800"
              >
                Ingresar
              </button>
            </div>
          </form>
          <div className="flex justify-between mt-4 w-full">
            <button className="text-sm text-teal-700 hover:underline">
              Forgot Password?
            </button>
            <button className="text-sm text-teal-700 hover:underline">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
