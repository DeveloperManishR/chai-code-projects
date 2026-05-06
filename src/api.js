const BASE_URL = "https://api.freeapi.app/api/v1/users";

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};

export const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(`${BASE_URL}/current-user`);

  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
  });

  return response.json();
};