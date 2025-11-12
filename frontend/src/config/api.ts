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
        console.log("error", error);
        reject(error.message);
      });
  });
};
