// src/components/Auth/Login.tsx
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Login.css";
import { Transition } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

interface Errors {
  email: string;
  password: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = (): boolean => {
    let valid = true;
    let emailError = "";
    let passwordError = "";

    if (!email) {
      emailError = "Email is required.";
      valid = false;
    }

    if (!password) {
      passwordError = "Password is required.";
      valid = false;
    }

    setErrors({ email: emailError, password: passwordError });
    return valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log("Attempting to log in with email:", email);
        const userCredential = await login(email, password);
        const user = userCredential.user;
        console.log("User authenticated:", user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User document found:", userData);
          const role = userData?.role;
          const completedRegistration = userData?.completedRegistration;
          const currentStep = userData?.currentStep;

          console.log("User role:", role);
          console.log("User completedRegistration:", completedRegistration);
          console.log("User currentStep:", currentStep);

          if (role === "propietario") {
            if (completedRegistration) {
              console.log("Redirecting to /dashboard-propietarios");
              navigate("/dashboard-propietarios");
            } else {
              console.log(`Redirecting to /proceso-de-alta/${currentStep}`);
              navigate(`/proceso-de-alta/${currentStep}`);
            }
          } else if (role === "huesped") {
            console.log("Redirecting to /dashboard-huespedes");
            navigate("/dashboard-huespedes");
          } else if (role === "empleado") {
            console.log("Redirecting to /dashboard-empleados");
            navigate("/dashboard-empleados");
          }
        } else {
          console.error("User document does not exist");
          setErrors({ email: "", password: "User data not found" });
        }
      } catch (error: any) {
        console.error("Error during login:", error);
        setErrors({ email: "", password: error.message });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center login-bg">
      <Transition
        show={true}
        enter="transition ease-out duration-1000 transform"
        enterFrom="opacity-0 translate-y-10"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-500 transform"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-10"
      >
        <div className="flex w-full max-w-4xl bg-white rounded-md shadow-lg login-container">
          <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 login-side">
            <h1 className="text-3xl font-bold">Bienvenido a Gloove</h1>
            <p className="mt-3 text-lg text-center">
              Gestiona tus alojamientos turísticos con facilidad y eficiencia.
            </p>
          </div>
          <div className="w-full p-8 md:w-1/2 flex flex-col items-center">
            <img
              src="/gloove_marca.png"
              alt="Gloove Logo"
              className="login-logo"
            />
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Sign In
            </h2>
            <form className="mt-6 space-y-4 w-full" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="hello@gloove.me"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
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
      </Transition>
    </div>
  );
};

export default Login;
