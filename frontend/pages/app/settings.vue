<script setup lang="ts">
import md5 from "md5";
import { User } from "~/types/IUser";
definePageMeta({
    layout: "app-navigation",
});
let isLoading = ref(false);
const router = useRouter();
const toast = useToast();
const userCookie = useCookie("user");

const user: User = toRaw(userCookie.value?.user);

function signOut() {
    isLoading.value = true;
    userCookie.value = null;
    toast.add({
        color: "green",
        icon: "i-heroicons-check",
        title: "Success",
        description: "You are now logged out",
    });
    router.push("/auth/sign-in");
    isLoading.value = false;
}
</script>
<template>
    <div>
        <Head>
            <Title>Settings</Title>
        </Head>
        <div class="flex flex-wrap items-center justify-between gap-4">
            <h1 class="text-4xl font-bold text-dark dark:text-light hidden sm:block">Settings</h1>
            <p class="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

        </div>
        <div class="flex flex-col gap-4 mt-10">
            <span class="text-dark dark:text-light font-bold text-2xl">My account</span>
            <div class="flex items-center gap-2">
                <img :src="`https://www.gravatar.com/avatar/${md5(user.email.trim().toLowerCase())}`" class="w-16 h-16 rounded-full" />
                <div class="flex flex-col">
                    <span class="text-dark dark:text-light font-bold text-xl">{{ user.name }}</span>
                    <span class="text-dark dark:text-light">{{ user.email }}</span>
                </div>
            </div>
            <div class="space-y-12">
              <div class="border-b border-gray-900/10 pb-12">

                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div class="sm:col-span-4">
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900">password</label>
                    <div class="mt-2">
                      <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input type="password" name="password" id="password" autocomplete="password" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="janesmith" />
                        <button type="button" class="rounded-r-md bg-gray-100 px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Change</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>

            <div class="border-b border-gray-900/10 pb-12">
              <h2 class="text-base font-semibold leading-7 text-gray-900">User Preferences</h2>
              <p class="mt-1 text-sm leading-6 text-gray-600">Customize your user preferences.</p>

              <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div class="sm:col-span-4">
                  <label for="language" class="block text-sm font-medium leading-6 text-gray-900">Language</label>
                  <div class="mt-2">
                    <select id="language" name="language" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      <option value="en">English</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>

                <div class="sm:col-span-4">
                  <label for="timezone" class="block text-sm font-medium leading-6 text-gray-900">Timezone</label>
                  <div class="mt-2">
                    <select id="timezone" name="timezone" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      <option value="gmt-1">GMT-1</option>
                      <option value="gmt-2">GMT-2</option>
                      <option value="gmt-3">GMT-3</option>
                    </select>
                  </div>
                </div>

                <div class="col-span-full">
                  <legend class="text-sm font-semibold leading-6 text-gray-900">Notification Preferences</legend>
                  <div class="mt-6 space-y-6">
                    <div class="relative flex gap-x-3">
                      <div class="flex h-6 items-center">
                        <input id="email-notifications" name="notification-preferences" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
                      </div>
                      <div class="text-sm leading-6">
                        <label for="email-notifications" class="font-medium text-gray-900">Email Notifications</label>
                        <p class="text-gray-500">Receive email notifications for important updates.</p>
                      </div>
                    </div>
                    <div class="relative flex gap-x-3">
                      <div class="flex h-6 items-center">
                        <input id="push-notifications" name="notification-preferences" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
                      </div>
                      <div class="text-sm leading-6">
                        <label for="push-notifications" class="font-medium text-gray-900">Push Notifications</label>
                        <p class="text-gray-500">Receive push notifications on your mobile device.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="sm:col-span-4">
                  <label class="block text-sm font-medium leading-6 text-gray-900">Theme</label>
                  <div class="mt-2">
                    <select id="theme" name="theme" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

          <div class="mt-6 flex items-center justify-between">
            <div>
              <UButton icon="i-heroicons-arrow-left-on-rectangle" color="red" variant="solid" @click="signOut" :loading="isLoading">Sign Out</UButton>
            </div>
            <div class="space-x-6">
              <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
              <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
            </div>
          </div>
        </div>
    </div>
</template>
