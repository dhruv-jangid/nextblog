export default function Blog({ params }: { params: { id: string } }) {
  console.log(params);
  return <div>Blog {params.id}</div>;
}
