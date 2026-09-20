import { Link } from "react-router-dom";
export default function NotFound(){return <div className="not-found"><div className="not-found-number">404</div><h1>Page not found</h1><p>The page you're looking for doesn't exist or has moved.</p><Link to="/app" className="btn btn-primary">Back to dashboard</Link></div>}
