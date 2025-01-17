export default async function Profile({ params }) {
  const { username } = await params;

  return <div>Profile of {username}</div>;
}
