import { redirect } from "@react-router/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@react-router/node";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { ResetPasswordCard } from "~/modules/authentication";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/dashboard");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  try {
    await AuthService.resetPassword(token, password);
    return redirect("/auth/login");
  } catch (error: unknown) {
    return { error: (error as Error).message ?? "Reset failed" };
  }
}

export default function ResetPasswordRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <ResetPasswordCard />
    </div>
  );
}
