const BASE = import.meta.env.DEV
  ? "/api/v1"
  : "https://1-community-watch-api.vercel.app/api/v1";

export class ApiError extends Error {
  constructor(message, { status, details } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function messageForStatus(status, body) {
  const serverMessage =
    body && typeof body === "object"
      ? body.message || body.error || body.detail
      : null;

  if (serverMessage) return serverMessage;

  switch (status) {
    case 400:
      return "That request was missing information or was formatted incorrectly.";
    case 401:
      return "You need to be signed in to do that.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 409:
      return "That already exists.";
    case 422:
      return "Some fields need to be corrected before this can be submitted.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    default:
      if (status >= 500)
        return "The server ran into a problem. Please try again shortly.";
      return "Something went wrong with that request.";
  }
}

/**
 * apiFetch: the single entry point for talking to the Community Watch API.
 *
 * @param {string} path
 * @param {object} options
 * @param {object} config
 * @param {boolean} config.on401
 */
export async function apiFetch(path, options = {}, config = {}) {
  const { method = "GET", headers = {}, body, ...rest } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...rest,
      method,
      credentials: "include", // let the browser send/receive the httpOnly cookie
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Accept: "application/json",
        ...headers,
      },
      body: body == null ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (networkErr) {
    throw new ApiError(
      "Couldn't reach the Community Watch server. Check your connection and try again.",
      { status: 0, details: networkErr },
    );
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null; // non-JSON body; keep going, we still have response.status
    }
  }

  if (response.status === 401 && config.on401 !== false) {
    throw new ApiError(messageForStatus(401, data), {
      status: 401,
      details: data,
    });
  }

  if (!response.ok) {
    throw new ApiError(messageForStatus(response.status, data), {
      status: response.status,
      details: data,
    });
  }

  if (data && typeof data === "object" && "data" in data && "success" in data) {
    return data.data;
  }
  return data;
}

export const api = {
  get: (path, options) => apiFetch(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    apiFetch(path, { ...options, method: "POST", body }),
  patch: (path, body, options) =>
    apiFetch(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => apiFetch(path, { ...options, method: "DELETE" }),
};
