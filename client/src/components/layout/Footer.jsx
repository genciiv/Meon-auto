export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-title">Auto Meon</div>
          <div className="muted">Platformë profesionale për shitje & reklamim mjetesh.</div>
        </div>
        <div className="muted">© {new Date().getFullYear()} Auto Meon</div>
      </div>
    </footer>
  );
}
