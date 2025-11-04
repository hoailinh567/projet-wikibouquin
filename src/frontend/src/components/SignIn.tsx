import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/signin`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Stocker l'utilisateur dans le context
        setUser(data.user);
        // Rediriger vers la page d'accueil
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Connexion échouée");
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start bg-[url('/bg-signin.jpg')] bg-center bg-no-repeat bg-cover min-h-screen pt-8 md:pt-20 lg:pt-30 px-4">
      <div className="rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md bg-white">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#6B5B4C]">
            Connexion
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Connectez-vous à votre compte
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm md:text-base text-center mb-4">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              className="border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label
                className="mb-1 font-semibold text-sm md:text-base text-gray-700"
                htmlFor="password"
              >
                Mot de passe
              </label>
              <a
                href="#"
                className="text-xs md:text-sm text-gray-600 hover:underline font-bold"
              >
                Mot de passe oublié ?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#6C7A89] text-white font-semibold py-2 text-sm md:text-base rounded-lg hover:bg-[#07315f] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-xs md:text-sm text-center text-gray-600 mt-2">
            Pas encore de compte ?{" "}
            <a
              href="/signup"
              className="text-gray-600 font-bold hover:underline"
            >
              S'inscrire
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
