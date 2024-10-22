"use strict";

async function vallauriRequest(url, method = "GET", headers = {}, body = null) {
  try {
    console.log(headers)
    const options = {
      method: method,
      headers: headers,
      body: null,
    };

    if (method !== "GET" && body) {
      options.body = body instanceof FormData ? body : JSON.stringify(body);

      if (!(body instanceof FormData)) {
        options.headers["Content-Type"] = "application/json";
      }
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}