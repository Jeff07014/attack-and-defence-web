// import { MDXLayoutRenderer } from 'pliny/mdx-components'
// import { MDXComponents } from '@/components/MDXComponents'
// import { PrismaClient } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
// import PostLayout from '@/layouts/PostLayout'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import Image from '@/components/Image'

// const prisma = new PrismaClient()
// const DEFAULT_LAYOUT = 'AuthorLayout'

// export const getServerSideProps = async ({ req }) => {
//   const s = getSession()
//   const profile = await prisma.user.findUnique({ where: { name: s.user.name } })
//   return {
//     props: {
//       profile,
//     },
//   }
// }
export default function Profile() {
  const { data: session } = useSession({
    required: true,
  })

  const router = useRouter()
  // const [data, setData] = useState(null)
  const fetcher = (...args) => fetch(...args).then((res) => res.json())

  const { data, error } = useSWR('/api/profile', fetcher)
  // console.log(data)

  // useEffect(() => {
  //   setLoading(true)
  //   fetch('/api/profile')
  //   // prisma.user.findUnique({ where: { name: s.user.name } })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data)
  //       setLoading(false)
  //     })
  //     .catch((err) => {
  //       console.log('unauthenticated')
  //     })
  // }, [])

  const [imageSrc, setImageSrc] = useState()
  // const [url, setUrl] = useState()

  // function dragAndDrop(e) {
  //   const files = e.target.files;
  //   files.length > 0 && setUrl(URL.createObjectURL(files[0]));
  // }

  function handleOnChange(changeEvent) {
    const reader = new FileReader()

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result)
    }

    if (changeEvent.target.files) reader.readAsDataURL(changeEvent.target.files[0])
  }

  async function handleOnSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'file-upload')

    const formData = new FormData()

    const newProfile = {
      username: form.username.value,
    }

    if (fileInput.files.length !== 0) {
      for (const file of fileInput.files) {
        formData.append('file', file)
      }

      formData.append('upload_preset', 'attack-and-defence-mid')

      await fetch('https://api.cloudinary.com/v1_1/dkp9uz35r/image/upload', {
        method: 'POST',
        body: formData,
      })
        .then((r) => r.json())
        .then((data) => {
          newProfile.image = data.url
          console.log(newProfile)
        })
    }

    const update = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfile),
    }).then((r) => r.json())

    console.log(update)
    setImageSrc(null)
    router.reload()
  }
  if (error) {
    console.log('error:', error)
    console.log('data:', data)
    return <div>Failed to load</div>
  }
  if (!data) return <div>Loading...</div>

  if (session)
    return (
      <>
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Profile
          </h1>
        </div>
        <div className="container flex py-12">
          <div className="h-fit w-fit overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 dark:border-gray-700">
            <Image
              className="rounded-full p-5"
              src={data.image}
              alt="Not Found"
              width={300}
              height={300}
            />
            <div className="text-center">
              <h1 className="m-6 border-b-2 p-3 text-2xl">{data.name}</h1>
              <p className="m-auto p-3">{data.email}</p>
            </div>
          </div>

          <form
            method="POST"
            encType="multipart/form-data"
            onChange={handleOnChange}
            onSubmit={handleOnSubmit}
          >
            <div className="px-10">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                  Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          autoComplete="username"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          defaultValue={data.name}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      About
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        rows="3"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      ></textarea>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Write a few sentences about yourself.
                    </p>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Photo
                    </label>
                    <div className="mt-2 flex items-center gap-x-3">
                      <Image
                        className="h-12 w-12 rounded-full text-gray-300"
                        src={data.image}
                        alt="Not Found"
                        width={200}
                        height={200}
                      />
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          Upload
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          accept="image/*"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Cover photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      {imageSrc ? (
                        <Image src={imageSrc} alt="Not Found" />
                      ) : (
                        <div className="text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-200"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-100">
                            <span>Upload a file</span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600 dark:text-gray-100">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    )
  // <>{JSON.stringify(data.name, null, 2)}</>
  // <>{session ? session.user.name : console.log('not login')}</>
  // <>{profile ? console.log(profile) : console.log('not login!')}</>
  // <MDXLayoutRenderer
  //   layout={DEFAULT_LAYOUT}
  //   content={profile}
  //   MDXComponents={MDXComponents}
  // />
}
