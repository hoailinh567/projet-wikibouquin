import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

type User = {
  id: Number;
  username: String;
  role_id: Number;
};

function MyProfile() {
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

  return <h1>Bonjour {data.username} !</h1>;
}

export default MyProfile;
