import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Header from "../Pages/Header";
import "./Login.css";
import { Transition } from "@headlessui/react";
import { ExclamationCircleIcon, EyeIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";
import { Tooltip } from "react-tooltip"; // Importar correctamente react-tooltip
import { useTranslation } from "react-i18next"; // Internacionalización
import { EyeOffIcon } from "lucide-react";

interface Errors {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const { t } = useTranslation(); // Usar para traducciones

  // Validaciones en tiempo real
  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: t("Correo electrónico inválido."),
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  }, [email, t]);

  useEffect(() => {
    if (password) {
      if (password.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: t("La contraseña es demasiado corta."),
        }));
        setPasswordStrength(t("Débil"));
      } else {
        setErrors((prev) => ({ ...prev, password: "" }));
        setPasswordStrength(t("Fuerte"));
      }
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
      setPasswordStrength("");
    }
  }, [password, t]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!errors.email && !errors.password) {
      setLoading(true);
      try {
        const userCredential = await login(email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData?.role;
          const completedRegistration = userData?.completedRegistration;
          const currentStep = userData?.currentStep;

          Swal.fire({
            title: t(`¡Bienvenido, ${role}!`),
            text: t(
              `Gracias por iniciar sesión, ${role}. Estamos encantados de verte de nuevo.`
            ),
            icon: "success",
            confirmButtonText: t("Continuar"),
          }).then(() => {
            if (role === "propietario") {
              if (completedRegistration) {
                navigate("/dashboard-propietarios");
              } else {
                navigate(`/proceso-de-alta/${currentStep}`);
              }
            } else if (role === "huesped") {
              navigate("/dashboard-huespedes");
            } else if (role === "empleado") {
              navigate("/dashboard-empleados");
            }
          });
        } else {
          throw new Error(t("No se encontraron datos del usuario."));
        }
      } catch (error: any) {
        Swal.fire({
          title: t("Error"),
          text: error.message,
          icon: "error",
          confirmButtonText: t("Intentar de nuevo"),
        });
        setErrors({ email: "", password: error.message });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
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
          <div className="flex w-full max-w-4xl bg-white dark:bg-gray-800 rounded-md shadow-lg login-container">
            <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 login-side dark:text-white">
              <h1 className="text-3xl font-bold">{t("Bienvenido a Gloove")}</h1>
              <p className="mt-3 text-lg text-center">
                {t(
                  "Gestiona tus alojamientos turísticos con facilidad y eficiencia."
                )}
              </p>
            </div>
            <div className="w-full p-8 md:w-1/2 flex flex-col items-center">
              <img
                src="/gloove_marca.png"
                alt="Logo de Gloove"
                className="login-logo"
              />
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                {t("Iniciar Sesión")}
              </h2>
              <form className="mt-6 space-y-4 w-full" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("Correo Electrónico")}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } dark:bg-gray-900 dark:text-white`}
                      placeholder="correo@gloove.me"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    {errors.email && (
                      <>
                        <div
                          data-tip={errors.email}
                          data-for="email-error-tooltip"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                        >
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        </div>
                        <Tooltip
                          id="email-error-tooltip"
                          place="top"
                          // Utiliza el efecto por defecto y evita usar la propiedad `effect`
                        />
                      </>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("Contraseña")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } dark:bg-gray-900 dark:text-white`}
                      placeholder="************"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-6 w-6" />
                      ) : (
                        <EyeIcon className="h-6 w-6" />
                      )}
                    </button>
                    {errors.password && (
                      <>
                        <div
                          data-tip={errors.password}
                          data-for="password-error-tooltip"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                        >
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        </div>
                        <Tooltip
                          id="password-error-tooltip"
                          place="top"
                          // Utiliza el efecto por defecto y evita usar la propiedad `effect`
                        />
                      </>
                    )}
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {t("Fortaleza de la contraseña")}: {passwordStrength}
                  </p>
                </div>
                <div>
                  <button
                    type="submit"
                    className={`w-full px-4 py-2 font-bold text-white bg-teal-700 rounded-md hover:bg-teal-800 transition-colors duration-300 ${
                      loading && "cursor-not-allowed opacity-50"
                    }`}
                    disabled={loading}
                  >
                    {loading ? <div className="loader"></div> : t("Ingresar")}
                  </button>
                </div>
              </form>
              <div className="flex justify-between mt-4 w-full">
                <button className="text-sm text-teal-700 dark:text-teal-300 hover:underline">
                  {t("¿Olvidaste tu contraseña?")}
                </button>
                <button className="text-sm text-teal-700 dark:text-teal-300 hover:underline">
                  {t("Registrarse")}
                </button>
              </div>
              <div className="mt-6 w-full flex flex-col space-y-3">
                <GoogleLoginButton
                  iconSize="24px"
                  style={{ height: "48px" }}
                  onClick={loginWithGoogle}
                />
                <FacebookLoginButton
                  iconSize="24px"
                  style={{ height: "48px" }}
                  onClick={loginWithFacebook}
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
};

export default Login;
