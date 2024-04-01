export default function NotFound() {
  return (
    <div>
      <h1 style={{ marginBottom: 0 }}>404</h1>
      <p>This page could not be found.</p>
      <button onClick={() => window.open("/")}>Go Home</button>
    </div>
  );
}
