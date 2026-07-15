import { useEffect, useState } from "react";
import api from "../services/api";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api
      .get("/api/history")
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">History</h1>

      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        history.map((h, index) => (
          <div key={index} className="border p-4 mt-4 rounded">
            <h3 className="font-bold">{h.item}</h3>

            {h.result && (
              <>
                <p><strong>Category:</strong> {h.result.category}</p>
                <p><strong>Hazard:</strong> {h.result.hazard}</p>
                <p><strong>Recyclable:</strong> {h.result.recyclable}</p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default History;