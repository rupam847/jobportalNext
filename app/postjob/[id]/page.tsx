import axios from 'axios';
import PostJob from './postJob';

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <PostJob />;
}

// 👇 Generate static paths for export
export async function generateStaticParams() {
  const filter = {
    page: 1,
  };
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/get-jobs`, filter);
  const jobs = response.data.data;

  if (!Array.isArray(jobs)) {
    console.error("generateStaticParams: 'data' is not an array", jobs);
    return [];
  }

  return jobs.map((job: { id: string }) => ({
    id: job.id,
  }));
}
