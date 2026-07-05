import LoginPageClient from "./page-client";

type LoginPageProps = {
  searchParams?: Promise<{
    logout?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return <LoginPageClient logout={params?.logout} next={params?.next} />;
}
