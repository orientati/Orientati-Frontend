"use strict";

async function vallauriRequest(url, method = "GET", headers = {}, body = null) {
  try {
    const options = {
      method: method,
      header: headers,
      body: null,
    };

    if (method !== "GET" && body) {
      options.body = body instanceof FormData ? body : JSON.stringify(body);

      if (!(body instanceof FormData)) {
        options.header["Content-Type"] = "application/json";
      }
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
