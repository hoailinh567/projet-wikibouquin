import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) newErrors.username = "Le nom est obligatoire.";
    if (!email.trim()) newErrors.email = "L'email est obligatoire.";
    else if (!validateEmail(email)) newErrors.email = "Email invalide.";
    if (!password.trim())
      newErrors.password = "Le mot de passe est obligatoire.";
    else if (password.length < 6)
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères.";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    if (!terms)
      newErrors.terms = "Vous devez accepter les conditions d'utilisation.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password, confirmPassword }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate("/signin");
    }
  };

  return (
    <div className="flex justify-center items-start bg-[url('/bg-signup.jpg')] bg-center bg-no-repeat bg-cover min-h-screen pt-8 md:pt-10 lg:pt-16 px-4">
      <div className="rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md bg-white">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#6B5B4C]">
            Sign Up
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Créer votre compte ici
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              className="mb-1 font-semibold text-sm md:text-base text-gray-700"
              htmlFor="username"
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              placeholder="Entrez votre nom"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 ${errors.username
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
                }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.username}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              className="mb-1 font-semibold text-sm md:text-base text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 ${errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              className="mb-1 font-semibold text-sm md:text-base text-gray-700"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 ${errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              className="mb-1 font-semibold text-sm md:text-base text-gray-700"
              htmlFor="confirmPassword"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 ${errors.confirmPassword
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className={`w-4 h-4 mt-1 rounded focus:ring-2 ${errors.terms
                  ? "text-red-500 focus:ring-red-400"
                  : "text-blue-600 focus:ring-blue-400"
                }`}
            />
            <label htmlFor="terms" className="text-xs md:text-sm text-gray-600">
              J'accepte{" "}
              <a href="#" className="hover:underline font-bold">
                les conditions d'utilisation
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-xs md:text-sm mt-1">
              {errors.terms}
            </p>
          )}

          <button
            type="submit"
            className="bg-[#6C7A89] text-white font-semibold py-2 text-sm md:text-base rounded-lg hover:bg-[#07315f] transition cursor-pointer"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
