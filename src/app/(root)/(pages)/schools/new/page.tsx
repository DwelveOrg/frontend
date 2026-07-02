import { redirect } from "next/navigation";

import { getUser } from "../../../_utils/getUser";
import CreateSchoolForm from "./_components/CreateSchoolForm";

export default async function NewSchoolPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="py-6">
      <CreateSchoolForm />
    </section>
  );
}
