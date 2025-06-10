export default function StatusMessage({ status }) {
  if (!status) return null;

  return (
    <div className={`status ${status.type}`}>
      {status.message}
    </div>
  );
}