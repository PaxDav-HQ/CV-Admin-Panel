// src/utils/errorParser.js

export const extractErrorMessage = (err, fallback = "An unexpected error occurred. Please try again.") => {
  if (!err) return fallback;

  // 1. If backend didn't respond (Network failure, timeout, CORS)
  if (!err.response) {
    if (err.code === "ECONNABORTED") return "Request timed out. Please check your internet connection.";
    if (err.message === "Network Error") return "Network error. Please check your internet connection.";
    return err.message || fallback;
  }

  const { data, status } = err.response;

  // 2. If data is completely missing or empty
  if (!data) {
    if (status === 401) return "Session expired. Please log in again.";
    if (status === 403) return "You do not have permission to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status >= 500) return "Server error. Our team has been notified. Please try again later.";
    return fallback;
  }

  // 3. If the backend returned a simple string
  if (typeof data === "string") {
    // Avoid dumping long raw HTML error pages (e.g., 502/504 Bad Gateway from Nginx)
    return data.trim().startsWith("<") ? "Server error occurred. Please try again later." : data;
  }

  // 4. Common standard string properties: { message: "..." }, { error: "..." }, { detail: "..." }
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  if (typeof data.detail === "string" && data.detail.trim()) return data.detail;

  // 5. Array of errors: e.g. { errors: ["Invalid title", "Price required"] } or { message: [...] }
  const arrayCandidate = Array.isArray(data.errors) 
    ? data.errors 
    : Array.isArray(data.message) 
    ? data.message 
    : Array.isArray(data) 
    ? data 
    : null;

  if (arrayCandidate && arrayCandidate.length > 0) {
    return arrayCandidate
      .map((item) => {
        if (typeof item === "string") return item;
        return item.message || item.msg || item.error || JSON.stringify(item);
      })
      .join(" • ");
  }

  // 6. Key-Value validation objects: e.g. { errors: { email: ["Invalid email"], price: "Must be number" } }
  const objectCandidate = typeof data.errors === "object" && data.errors !== null 
    ? data.errors 
    : typeof data.fields === "object" && data.fields !== null 
    ? data.fields 
    : null;

  if (objectCandidate) {
    const errorStrings = [];
    for (const [key, val] of Object.entries(objectCandidate)) {
      const formattedKey = key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
      if (typeof val === "string") {
        errorStrings.push(`${formattedKey}: ${val}`);
      } else if (Array.isArray(val)) {
        errorStrings.push(`${formattedKey}: ${val.join(", ")}`);
      } else if (val && typeof val === "object") {
        errorStrings.push(`${formattedKey}: ${val.message || val.msg || JSON.stringify(val)}`);
      }
    }
    if (errorStrings.length > 0) {
      return errorStrings.join(" • ");
    }
  }

  // 7. Last resort fallback
  return fallback;
};