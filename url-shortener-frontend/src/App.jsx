import { useState } from "react";
import api from "./api";
import { QRCodeCanvas } from "qrcode.react";

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiry, setExpiry] = useState("");

  const handleShorten = async () => {
    setMessage("");
    setShortUrl("");

    if (!longUrl.trim()) {
      setMessage("Please enter a URL!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/shorten", {
        longUrl,
        customCode,
        expiry
      });

      setShortUrl(res.data.shortUrl);
      setMessage("Short URL created!");
    } catch (err) {
      console.error(err);
      setMessage("Error: " + (err.response?.data?.error || "Could not shorten URL."));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setMessage("Copied to clipboard!");
    } catch {
      setMessage("Unable to copy.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-5 text-center">URL Shortener</h1>

        <div className="flex flex-col gap-3 mb-4">

          {/* Long URL input */}
          <input
            type="text"
            placeholder="Paste long URL..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring outline-none"
          />

          {/* Custom Code input */}
          <input
            type="text"
            placeholder="Custom short code (optional)"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring outline-none"
          />

          {/* Button */}
          <button
            onClick={handleShorten}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Shorten"}
          </button>
        </div>

        <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring outline-none"
          >
            <option value="">No Expiration</option>
            <option value="1h">1 Hour</option>
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>


        {/* Message */}
        {message && (
          <p className="text-sm text-gray-700 mb-2">{message}</p>
        )}

        {shortUrl && (
          <div className="mt-4 space-y-4">
            {/* Short URL Display */}
            <div className="bg-gray-100 border rounded-lg p-4 flex items-center justify-between">
              <a
                href={shortUrl}
                target="_blank"
                className="text-blue-600 underline break-all"
              >
                {shortUrl}
              </a>

              <button
                onClick={copyToClipboard}
                className="bg-gray-800 text-white px-3 py-1 rounded-lg"
              >
                Copy
              </button>
            </div>

            {/* QR Code Section */}
            <div className="bg-white border rounded-lg p-4 shadow flex flex-col items-center">
              <p className="text-gray-700 mb-2">Scan QR Code:</p>
              <QRCodeCanvas value={shortUrl} size={150} />
            </div>
          </div>
        )}
        

      </div>
    </div>
  );
}
