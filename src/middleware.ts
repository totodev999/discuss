import { v4 } from 'uuid';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // just logging the request
  // To log when requests end we hav another logging mechanism in server actions.And to trace logs we have logId
  const uuid = v4();
  // Maybe in production it's more suitable to use request.ip than x-forwarded-for
  console.log(
    `[start]-[${new Date().toLocaleString()}]-[${request.method}]-[${
      request.nextUrl
    }]-[${request.headers.get('x-forwarded-for')}]-[${uuid}]`
  );

  // TODO: Maybe updating version will solve this problem and you will not have to create new headers
  // Bug:https://github.com/vercel/next.js/issues/49442
  request.headers.set('x-log-id', uuid);
  const headers = new Headers(request.headers);

  const response = NextResponse.next({ request: { headers } });
  // if you want to add some information to the response, you can do it here
  // Note: You can not log response data or status. You can not see response data.

  return response;
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// };
