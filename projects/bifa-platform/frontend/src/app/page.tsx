export default async function Home() {
  const res = await fetch("http://localhost:5000/hello");
  const data = await res.json();

  return (
    <main className="p-10">
      <h1 className="text-xl font-bold">{data.message}</h1>
    </main>
  );
}
