import { NewPasswordForm } from "@/components/auth/new-password-form";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const NewPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <NewPasswordForm />
      </div>
    </Suspense>
  );
};

export default NewPasswordPage;
