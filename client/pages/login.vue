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
      <div class="container px-4 border mx-auto bg-white">
        <div class="py-4">
          <div class="font-bold text-xl">Join now!</div>
          <div class="text-gray-700">To get started, enter your information below!</div>
        </div>

        <div class="py-4 text-gray-800">
          Your API-Key:<br>
          <input v-model="apiKey" placeholder="API-Key" value="uNQITnqDPSGhs84BosLA0zOCcTMxRaIg" class="p-1 border w-full">
        </div>

        <div class="py-4 text-gray-800">
          Your X-App-Token:<br>
          <input v-model="appToken" placeholder="X-App-Token" value="cc62b5bb-6feb-4f39-a839-9a875710507c" class="p-1 border w-full">
        </div>

        <button v-if="loading" class="my-4 bg-gray-500 text-white font-bold text-lg p-1 rounded w-full">Loading...</button>
        <button v-else class="my-4 bg-green-500 text-white font-bold text-lg p-1 rounded w-full" @click="login">Start now!</button>

        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
const appSecrets = require('../../app-secrets.json') || {}
const tikkieApiV2Secrets = appSecrets['tikkie-api-v2'] || {}

export default {
  asyncData: ({ store, router }) => {
    if (store.state.business.business !== null) {
      router.push('/dashboard')
    }

    return {
      error: undefined,
      apiKey: tikkieApiV2Secrets['API-Key'],
      appToken: tikkieApiV2Secrets['X-App-Token'],
      loading: false
    }
  },
  methods: {
    async login () {
      // Loading
      this.error = undefined
      this.loading = true

      try {
        // Call POST server/business
        const data = { apiKey: this.apiKey, appToken: this.appToken }
        const business = await this.$axios.$post('http://localhost:17233/business', data)
        console.log('business was created: ', business)

        // if success, set in store and jump to dashboard
        this.$store.commit('business/set', business)
        this.$router.push('/dashboard')
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
