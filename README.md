This repository is based on below course.(almost the same, added some codes.)  
[Next JS: The Complete Developer's Guide](https://www.udemy.com/course/next-js-the-complete-developers-guide/?couponCode=MCLARENT71824)

## Getting Started

First, set up env.

```
touch .env.local
```

add below text to .env.local

```
GITHUB_CLIENT_ID="@replace"
GITHUB_CLIENT_SECRET="@replace"
AUTH_SECRET="@replace"
# set to solve following problem: Host must be trusted. URL was: http://localhost:3000/api/auth/session. Read more at https://errors.authjs.dev#j
AUTH_TRUST_HOST=TRUE
```

enter below commands

```
npm install
cd src
npx prisma init --datasource-provider sqlite
cd ..
mv -f ./schema.prisma ./src/prisma
cd src/prisma/
npx prisma migrate dev
npm run dev
```

reference  
use below commands, when you want to reset prisma.

```
rm -rf ./node_modules/
rm -rf ./src/prisma
```

## Points

- using App Router
- added some codes to ensure detailed logging at Server Actions.

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
