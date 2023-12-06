import { TIMEOUT } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(url);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT)]);
    const data = await response.json();

    if (!response.ok) throw Error(`${data.message} ${data.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    });

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT)]);
    const data = await response.json();

    if (!response.ok) throw Error(`${data.message} ${data.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};
