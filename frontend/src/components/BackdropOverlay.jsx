export default function BackdropOverlay({ children }) {
  return (
    <div className="fixed inset-0 z-30 flex justify-center items-center">
      <div className="absolute inset-0 bg-dark opacity-90"></div>
      {children}
    </div>
  );
}
