import Link from "next/link";

function UserProfile({ params }: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <br />
      <p className="text-4xl">
        Profile Page
        <span className="p-2 rounded-none bg-orange-700 text-black">
          {params.id}
        </span>
      </p>
      <Link
        href="/profile"
        className="p-2 border mt-4 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 bg-orange-400"
      >
        Back
      </Link>
    </div>
  );
}

export default UserProfile;
