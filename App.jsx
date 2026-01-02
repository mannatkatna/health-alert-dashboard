import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <div style={styles.page}>
      {!started ? (
        <Onboarding onStart={() => setStarted(true)} />
      ) : (
        <div style={{ width: "100%" }}>
          <h1 style={styles.title}>Health Analyser</h1>
          <HealthForm />
        </div>
      )}
    </div>
  );
}

/* onboarding */
function Onboarding({ onStart }) {
  return (
    <div style={styles.onboardingWrapper}>
    <div style={styles.card}>
      <h2>Welcome</h2>
      <p style={styles.subText}>
        Enter basic health details to get quick insights.
      </p>
      <button style={styles.primaryBtn} onClick={onStart}>
        Get Started
      </button>
    </div>
    </div>
  );
}

// health form
function HealthForm() {
  const [form, setForm] = useState({
    age: "",
    heartRate: "",
    bp: "",
    sugar: ""
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function analyzeHealth() {
    let status = "Normal";

    if (form.heartRate >= 100 || form.sugar >= 180 || form.bp >= 120) {
      status = "Attention";
    }

    if (form.heartRate >= 120 || form.sugar >= 250 || form.bp >= 160) {
      status = "Critical";
    }

    const entry = {
      date: new Date().toLocaleTimeString(),
      heartRate: parseInt(form.heartRate, 10) || 0,
      status
    };

    setHistory(prev => [...prev, entry]);
    setResult(status);
  }

  const isDisabled = !form.age || !form.heartRate || !form.bp || !form.sugar;

  return (
    <div style={styles.layout}>
      <div style={styles.card}>
        <h2>Enter Health Details</h2>
        <div style={styles.inputs}>
          <input
            placeholder="Age"
            name="age"
            style={styles.inputField}
            value={form.age}
            onChange={handleChange}
          />
          <input
            placeholder="Heart Rate (bpm)"
            name="heartRate"
            style={styles.inputField}
            value={form.heartRate}
            onChange={handleChange}
          />
          <input
            placeholder="Blood Pressure (systolic)"
            name="bp"
            style={styles.inputField}
            value={form.bp}
            onChange={handleChange}
          />
          <input
            placeholder="Blood Sugar (mg/dL)"
            name="sugar"
            style={styles.inputField}
            value={form.sugar}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={analyzeHealth}
          style={styles.primaryBtn}
          disabled={isDisabled}
        >
          Analyze Health
        </button>

        {result && <HealthResult status={result} />}
      </div>

      <div style={styles.card}>
        <h2>Trends</h2>
        {history.length > 0 ? (
          <>
            <div style={{ height: 300, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#4f46e5"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <h3 style={{ marginTop: 20 }}>History</h3>
            <div style={styles.historyList}>
              {history.map((item, index) => (
                <p key={index} style={styles.historyItem}>
                  <strong>{item.date}</strong> — {item.status}
                </p>
              ))}
            </div>
          </>
        ) : (
          <p style={styles.subText}>No data yet. Fill the form to see trends.</p>
        )}
      </div>
    </div>
  );
}

function HealthResult({ status }) {
  const clr = { Normal: "#2ecc71", Attention: "#f1c40f", Critical: "#e74c3c" };
  const message = {
    Normal: "All values are within a safe range.",
    Attention: "Some values need monitoring.",
    Critical: "Values are high. Consider consulting a doctor."
  };

  return (
    <div style={styles.resultBox}>
      <h3 style={{ color: clr[status] }}>{status}</h3>
      <p>{message[status]}</p>
    </div>
  );
}

// STYLES
const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw", 
    background: "#f5f7fa",
    padding: "20px",
    fontFamily: "system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    overflowX: "hidden"
  },
  onboardingWrapper:{
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding : "20px"
  },
  title: {
    margin: "20px 0 40px 0",
    color: "#1c1c1c",
    fontSize: "2.5rem",
    textAlign: "center"
  },
  layout: {
    display: "grid",

    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "30px",
    width: "100%", 
    maxWidth: "95%", 
    margin: "0 auto",
    alignItems: "start"
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    color: "#1c1c1c",
    width: "100%",
    boxSizing: "border-box"
  },
  inputs: {
    display: "grid",
    gap: "15px",
    marginBottom: "20px"
  },
  inputField: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px"
  },
  primaryBtn: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    background: "#4f46e5",
    width: "100%",
    fontSize: "16px",
    fontWeight: "600"
  },
  resultBox: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    background: "#f8fafc",
    borderLeft: "5px solid #4f46e5"
  },
  historyList: {
    maxHeight: "200px",
    overflowY: "auto",
    textAlign: "left",
    padding: "10px"
  },
  historyItem: {
    fontSize: "14px",
    color: "#4b5563",
    borderBottom: "1px solid #eee",
    padding: "8px 0"
  },
  subText: {
    fontSize: "16px",
    color: "#6b7280"
  }
};