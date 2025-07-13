import JobApply from './JobApply'; // ✅ Ensure correct casing

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <JobApply jobId={params.id} />;
}

// ✅ This must be defined and exported from page.tsx
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page: 1 }),
  });

  const json = await res.json();
  const jobs = json?.data;

  if (!Array.isArray(jobs)) return [];

  return jobs.map((job: { id: string }) => ({
    id: job.id,
  }));
}
