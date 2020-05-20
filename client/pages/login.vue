<template>
  <div class="bg-gray-200 min-h-screen">
    <div class="bg-gray-100 border-b mb-4">
      <div class="container mx-auto">
        <div class="p-4">
          <h1 class="text-xl font-bold">
            Tikkies for Businesses.
          </h1>
          <h2 class="text-gray-700">
            Do you have appointments that you want to get paid for? Use Tikkies for Businesses, connect to Tikkie API v2 in seconds, and get paid for your appointments!
          </h2>
        </div>
      </div>
    </div>
    <div>
      <div class="w-1/3 px-4 border mx-auto bg-white">
        <div class="py-4">
          <div class="font-bold text-xl">Join now!</div>
          <div class="text-gray-700">To get started, enter your information below!</div>
        </div>

        <div class="py-4 text-gray-800">
          Your API-Key:<br>
          <input v-model="appToken" placeholder="API-Key" class="p-1 border w-full">
        </div>

        <div class="py-4 text-gray-800">
          Your X-App-Token:<br>
          <input v-model="appToken" placeholder="X-App-Token" class="p-1 border w-full">
        </div>

        <button class="my-4 bg-green-500 text-white font-bold text-lg p-1 rounded w-full" @click="login">Start now!</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login () {
      // call POST server/business
      // if success, set cookie and jump to dashboard
    }
  }
}
</script>
