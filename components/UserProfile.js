import Link from './Link'
import { useSession } from 'next-auth/react'
import { Image } from 'next/image'
export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="items-center p-4">
        <Link href="/profile" className="flex p-1">
          <div className="basis-3/4">{session.user.name}</div>
          <div className="h-6 w-6 basis-1/4">
            <Image className="rounded-full" src={session.user.image} alt="Not Found" />
          </div>
        </Link>
      </div>
    )
    // <button onClick={() => signOut()}>Sign out</button>
  }
  return (
    <div className="p-4">Not signed in</div>
    // <button onClick={() => signIn()}>Sign in</button>
  )
}
