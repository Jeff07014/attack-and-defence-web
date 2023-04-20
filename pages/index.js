// import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
// import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
// import { formatDate } from 'pliny/utils/formatDate'
// import { sortedBlogPost, allCoreContent } from 'pliny/utils/contentlayer'
import { NewsletterForm } from 'pliny/ui/NewsletterForm'
// import { allBlogs } from 'contentlayer/generated'
// import { PrismaClient } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from '@/components/Image'
import useSWR from 'swr'

// const prisma = new PrismaClient()
// const MAX_DISPLAY = 5
// export const getServerSideProps = async () => {
//   const posts = await prisma.message.findMany()
//   return {
//     props: {
//       posts,
//     },
//   }
// }
export default function Home() {
  const { data: session } = useSession({})
  const router = useRouter()
  const fetcher = (...args) => fetch(...args).then((res) => res.json())
  const { data: posts, error } = useSWR('/api/message', fetcher)

  async function onSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget

    if (session) {
      const message = {
        name: session.user.name,
        content: form.message.value,
        timestamp: Date.now().toString(),
        image: session.user.image,
      }
      await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      }).then((r) => r.json())

      // console.log(update)
      router.reload()
    } else {
      alert('plese login first!')
    }
  }
  if (error) {
    console.log(error)
  }

  if (!posts) {
    return 'No messages found.'
  }
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            All messages
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>

        <form method="POST" onSubmit={onSubmit}>
          <div className="col-span-full py-12">
            <label
              htmlFor="message"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
            >
              Write something
            </label>
            <div className="mt-2">
              <textarea
                id="message"
                name="message"
                rows="3"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6 pb-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No messages Found'}
          {posts.map((post) => {
            const { id, name, timestamp, content, image } = post
            const time = new Date(parseInt(timestamp))
            return (
              <li key={id} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={timestamp}>{time.toString().substring(0, 24)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-3">
                        <div className="flex">
                          <Image
                            src={image}
                            alt="Not Found"
                            className="h-8 w-8 rounded-full"
                            width={300}
                            height={300}
                          />
                          <h2 className="px-3 text-xl font-bold leading-8 tracking-tight">
                            {name}
                          </h2>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {content}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {siteMetadata.newsletter.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
  // {posts.length > MAX_DISPLAY && (
  //   <div className="flex justify-end text-base font-medium leading-6">
  //     <Link
  //       href="/blog"
  //       className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
  //       aria-label="All posts"
  //     >
  //       All Posts &rarr;
  //     </Link>
  //   </div>
  // )}
}
