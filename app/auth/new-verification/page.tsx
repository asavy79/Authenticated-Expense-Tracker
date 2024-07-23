import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

const NewVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <NewVerificationForm />;
      </div>
    </Suspense>
  );
};

export default NewVerificationPage;
