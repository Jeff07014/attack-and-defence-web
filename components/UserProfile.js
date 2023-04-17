import Link from './Link'
import { useSession, signIn, signOut } from "next-auth/react"
export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="items-center p-4">
          <Link href="/profile" className="flex p-1">
        <div className="basis-3/4 grow">
            {session.user.name}
        </div>
        <div className="basis-1/4 w-6 h-6">
          <img className="rounded-full" src={session.user.image} />
        </div>
          </Link>
      </div>
    )
        // <button onClick={() => signOut()}>Sign out</button>
  }
  return (
    <div className="p-4">
      Not signed in
    </div>
      // <button onClick={() => signIn()}>Sign in</button>
  )
}
