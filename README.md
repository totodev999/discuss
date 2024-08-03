This repository is based on the following course.(almost the same, with some additional codes)  
[Next JS: The Complete Developer's Guide](https://www.udemy.com/course/next-js-the-complete-developers-guide/?couponCode=MCLARENT71824)

## Getting Started

First, set up env.

```
touch .env.local
```

Add the following text to .env.local:

```
GITHUB_CLIENT_ID="@replace"
GITHUB_CLIENT_SECRET="@replace"
AUTH_SECRET="@replace"
# set to solve following problem: Host must be trusted. URL was: http://localhost:3000/api/auth/session. Read more at https://errors.authjs.dev#j
AUTH_TRUST_HOST=TRUE
```

Run on local environment:

```
npm install --platform=linux/amd64
cd src
npx prisma init --datasource-provider sqlite
cd ..
cp -f ./schema.prisma ./src/prisma
cd src/prisma/
npx prisma migrate dev
npm run dev
```

Run on Docker:

```
npm install
cd src
npx prisma init --datasource-provider sqlite
cd ..
cp -f ./schema.prisma ./src/prisma
cd src/prisma/
npx prisma migrate dev
docker compose up
```

Reference:
Use the following commands when you want to reset Prisma.

```
rm -rf ./node_modules/
rm -rf ./src/prisma
```

## Points

- Using App Router
- Added some codes to ensure detailed logging at Server Actions.

## features

Main Page:http://localhost:3000/

- You can see Posts.
- You can create new Topics.
- You can move to Topics page.
- You can move to Posts page.
- You can search for articles by keywords.

Topics page:http://localhost:3000/topics/[slug]

- You can see Posts related to Topics.
- You can create Posts, of course, Posts you create will be related to Topics.
- You can move to Posts page.

Posts page:http://localhost:3000/topics/[slug]/posts/[postId]

- You can see the Post.
- You can see comments related to the Post.
- You can post comments to the Post and post comments to comments.

## problems

Prisma throws an error.
I presume the cause is storing data on the local machine instead of Docker to ensure data persistence. However, the local machine is a Mac, and Docker runs on Linux. This could be causing the problem. At least, this repository works despite this issue.

```
nextjs-1  |  ⨯ node_modules/@prisma/client/runtime/library.js (64:804) @ wa
nextjs-1  |  ⨯ unhandledRejection: PrismaClientInitializationError: Prisma Client could not locate the Query Engine for runtime "linux-musl-arm64-openssl-3.0.x".
nextjs-1  |
nextjs-1  | This is likely caused by a bundler that has not copied "libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node" next to the resulting bundle.
nextjs-1  | Ensure that "libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node" has been copied next to the bundle or in "../node_modules/.prisma/client".
nextjs-1  |
nextjs-1  | We would appreciate if you could take the time to share some information with us.
nextjs-1  | Please help us by answering a few questions: https://pris.ly/engine-not-found-bundler-investigation
nextjs-1  |
nextjs-1  | The following locations have been searched:
nextjs-1  |   /node_modules/.prisma/client
nextjs-1  |   /src/.next/server
nextjs-1  |   /src/.prisma/client
nextjs-1  |   /tmp/prisma-engines
nextjs-1  |     at wa (webpack-internal:///(ssr)/./node_modules/@prisma/client/runtime/library.js:4394:87)
nextjs-1  |     at async Object.loadLibrary (webpack-internal:///(ssr)/./node_modules/@prisma/client/runtime/library.js:5179:35)
nextjs-1  |     at async wt.loadEngine (webpack-internal:///(ssr)/./node_modules/@prisma/client/runtime/library.js:5300:60)
nextjs-1  |     at async wt.instantiateLibrary (webpack-internal:///(ssr)/./node_modules/@prisma/client/runtime/library.js:5275:72) {
nextjs-1  |   clientVersion: '5.14.0',
nextjs-1  |   errorCode: undefined
nextjs-1  | }
```

Reference(presumably related issues):
https://github.com/prisma/prisma/discussions/22519
https://stackoverflow.com/questions/77783363/how-to-use-docker-compose-file-with-next-js-prisma-and-sqlite
