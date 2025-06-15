export default function StatusMessage({ status }) {
  if (!status) return null;

  const statusIcons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌'
  };

  return (
    <div className={`status ${status.type}`}>
      <span className="icon">{statusIcons[status.type]}</span>
      {status.message}
    </div>
  );
}