import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

type User = {
  id: Number;
  username: String;
  email: String;
  role_id: Number;
};

function Account() {
  const [data, setData] = useState<User>({} as User);
  const myProfile = async () => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:3000/api/me`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);

      setData(await response.json());
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    myProfile();
  }, []);

  return (
    <div className="grow max-w-4xl mx-auto p-5 mt-10 font-playfair">

      <h2 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Bienvenue dans votre espace personnel
      </h2>

      <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg border border-gray-100 mx-auto max-w-xl">

        <h3 className="text-2xl font-semibold mb-6 text-blue-700 text-center">
          Informations personnelles
        </h3>

        <div className="space-y-5 text-lg">

          <div className="flex items-center gap-3">
            <span className="text-blue-600 text-2xl">👤</span>
            <p>
              <span className="font-bold text-gray-700">Nom d'utilisateur :</span>{" "}
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
        <h3 className="text-xl font-semibold mt-10 mb-4 text-blue-700">
          Changer le mot de passe
        </h3>

        <form className="space-y-4">

          <div>
            <label className="font-semibold text-gray-700">Mot de passe actuel</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value=""
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Nouveau mot de passe</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value=""
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value=""
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#6C7A89] w-full py-2 text-white rounded-lg hover:bg-[#07315f] transition"
          >
            Mettre à jour le mot de passe
          </button>

        </form>

      </div>
    </div>
  );

  }

export default Account;

