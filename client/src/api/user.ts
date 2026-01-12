import axiosInstance from "./axios";

export const deactivateUser = async () => {
  await axiosInstance.put("/users/me/deactivate");
};
