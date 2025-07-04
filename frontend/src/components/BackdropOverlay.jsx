export default function BackdropOverlay({ onClose,children }) {
  return (
    <div className="fixed inset-0 z-30 flex justify-center items-center">
      <div className="absolute inset-0 bg-dark opacity-90" onClick={()=>onClose()}></div>
      {children}
    </div>
  );
}


