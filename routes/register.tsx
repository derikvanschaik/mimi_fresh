import PasswordChooser from "../islands/PasswordChooser.tsx";

export const handler: Handlers<any, { data:any }> = {
    GET(req, ctx) {
      const url = new URL(req.url)
      return ctx.render({ error: url.searchParams.get('status') === 'failed'})
    },
  };
  
export default function Register({ data }) {
    return (
        <>
        <div class="bg-gray-50 dark:bg-gray-900">
          <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                  <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                  { data.error &&
                      <h1 class="text-xl font-bold leading-tight tracking-tight text-red-600 bg-gray-200 text-center px-4 py-1 rounded-md">
                          There was an error with your registration.
                      </h1>
                    }
                      <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                          Create Your account
                      </h1>
                      <form class="space-y-4 md:space-y-6" method="post" action="/api/register">
                          <div>
                              <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                              <input type="text" name="username" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                          </div>
                          <PasswordChooser />
                          
                          <button type="submit" class="w-full text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 dark:text-white">Register</button>
                          
                      </form>
                  </div>
              </div>
          </div>
      </div>
      </>
    );
  }