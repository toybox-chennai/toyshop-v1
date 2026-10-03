import { Navigate } from "react-router";

/**
 * The template's default signed-in destination. For TOYBOX the product
 * experience lives on the shop floor, so /dashboard hands off there —
 * it is also where /auth lands users who sign in without a returnTo.
 */
export default function Dashboard() {
  return <Navigate to="/shop" replace />;
}
