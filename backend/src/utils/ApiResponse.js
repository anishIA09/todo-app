class ApiResponse {
  constructor(statusCode, options = {}) {
    if (typeof options !== "object" || Array.isArray(options)) {
      this.data = null;
      this.message = String(options || "Success");
    } else {
      this.data = options.data ?? null;
      this.message = options.message ?? "Success";
    }

    this.statusCode = statusCode;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
