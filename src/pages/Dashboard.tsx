import { Navigate } from "react-router";

/**
 * Legacy route kept so old links still work; the product experience
 * lives on the shop floor, so /dashboard and /auth hand off there.
 */
export default function Dashboard() {
  return <Navigate to="/shop" replace />;
}
