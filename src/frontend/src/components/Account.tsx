import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { API_URL } from "../utils/api";

type User = {
  id: Number;
  username: String;
  email: String;
  role_id: Number;
};

function Account() {
  const [data, setData] = useState<User>({} as User);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, isLoading, navigate]);
  const myProfile = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/account`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);

      setData(await response.json());
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    myProfile();
  }, []);

  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    const response = await fetch(`${API_URL}/api/update-password`, {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const errors: { message: string }[] = Array.isArray(body) ? body : [];
      setFormError(
        errors.length
          ? errors.map((e) => e.message).join("\n")
          : (body?.error ?? "Une erreur est survenue."),
      );
      return;
    }

    setFormSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="grow max-w-4xl mx-auto p-4 md:p-5 mt-6 md:mt-10 font-playfair">
      <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-center text-gray-800">
        Bienvenue dans votre espace personnel
      </h2>

      <div className="bg-linear-to-br from-white to-blue-50 p-4 md:p-8 rounded-2xl shadow-lg border border-gray-100 mx-auto max-w-xl">
        <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-700 text-center">
          Informations personnelles
        </h3>

        <div className="space-y-5 text-base md:text-lg">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 text-2xl">👤</span>
            <p>
              <span className="font-bold text-gray-700">
                Nom d'utilisateur :
              </span>{" "}
              <span className="text-gray-900">{data.username}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-blue-600 text-2xl">✉️</span>
            <p>
              <span className="font-bold text-gray-700">Email :</span>{" "}
              <span className="text-gray-900">{data.email}</span>
            </p>
          </div>
        </div>

        {/* Formulaire changement de mot de passe */}
        <h3 className="text-lg md:text-xl font-semibold mt-6 md:mt-10 mb-3 md:mb-4 text-blue-700">
          Changer le mot de passe
        </h3>

        <form className="space-y-4" onSubmit={handleUpdatePasswordSubmit}>
          <div>
            <label className="font-semibold text-gray-700">
              Mot de passe actuel
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {formError && (
            <ul className="text-red-600 text-sm list-disc list-inside">
              {formError.split("\n").map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
          {formSuccess && (
            <p className="text-green-600 text-sm">
              Mot de passe mis à jour avec succès.
            </p>
          )}

          <button
            type="submit"
            className="bg-[#6C7A89] w-full py-2 text-white rounded-lg hover:bg-[#07315f] transition cursor-pointer"
          >
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}

export default Account;
