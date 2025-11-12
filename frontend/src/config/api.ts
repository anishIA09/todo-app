import axios, { AxiosHeaders } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 100000,
});

export const get = (
  url: string,
  params?: Record<string, any>,
  headers?: AxiosHeaders
) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(url, {
        headers,
        params,
        withCredentials: true,
      })
      .then((result) => {
        resolve({
          data: result.data,
        });
      })
      .catch(async (error) => {
        if (error.response.data.message === "jwt expired") {
          await refreshAccessToken().then(async (res) => {
            // resolve(res);
            const retryResult = await axiosInstance.get(url, {
              headers,
              params,
              withCredentials: true,
            });

            resolve({ data: retryResult.data });
          });
        } else {
          reject(error.response.data.message);
        }
      });
  });
};

export const refreshAccessToken = () => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .patch(
        "/auth/refresh-access-token",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log("error", error);

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname + window.location.search;
          const callbackUrl = encodeURIComponent(currentPath);

          window.location.href = `/auth/signin?callbackUrl=${callbackUrl}`;
        }
        reject(error);
      });
  });
};
