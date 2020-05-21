<template>
  <div class="bg-gray-200 min-h-screen">
    <div class="bg-gray-100 border-b mb-4">
      <div class="container mx-auto">
        <div class="p-4">
          <button to="/login" class="float-right bg-red-500 text-white font-bold text-lg p-3 rounded" @click="logout">
            Logout
          </button>
          <h1 class="text-xl font-bold">
            Dashboard of Tikkies for Businesses
          </h1>
          <h2 class="text-gray-700">
            Welcome to your dashboard! You can find the status of all your appointments below!
          </h2>
        </div>
      </div>
    </div>
    <div class="container mx-auto bg-gray-100 border mb-4 p-4">
      <div class="w-full font-bold text-lg border-b" @click="toggleOpen">Create new appointment</div>
      <div v-if="open">
        <div class="py-4 text-gray-800">
          Name of your customer:<br>
          <input v-model="customerName" placeholder="Name" class="p-1 bg-white border w-full">
        </div>

        <div class="py-4 text-gray-800">
          Amount in Cents<br>
          <input v-model="amountInCents" placeholder="100" class="p-1 bg-white border w-full">
        </div>

        <div class="py-4 text-gray-800">
          Description<br>
          <input v-model="description" placeholder="Description" class="p-1 bg-white border w-full">
        </div>

        <button v-if="loading" class="my-4 bg-gray-500 text-white font-bold text-lg p-1 rounded w-full">Loading...</button>
        <button v-else class="my-4 bg-green-500 text-white font-bold text-lg p-1 rounded w-full" @click="addAppointment">Add appointment</button>

        {{ error }}
      </div>
      <div v-else class="text-gray-700 pt-4" @click="toggleOpen">
        Click here to create a new apointment
      </div>
    </div>
    <hr class="mb-4">
    <div>
      <Appointment v-for="appointmentId in appointmentIds" :key="appointmentId" :id="appointmentId" />
    </div>
  </div>
</template>

<script>
import Appointment from '~/components/Appointment.vue'

export default {
  components: {
    Appointment
  },
  async asyncData ({ store, app, $axios }) {
    if (store.state.business.business === null) {
      app.router.push('/login')
    }

    const options = { headers: { 'X-Business-Id': store.state.business.business.businessId } }
    const appointmentIds = await $axios.$get('http://tikkie-businesses.simonkarman.nl:17233/appointment', options)

    return {
      error: undefined,
      open: false,
      loading: false,
      customerName: '',
      amountInCents: '100',
      description: '',
      appointmentIds
    }
  },
  methods: {
    logout () {
      this.$store.commit('business/set', null)
      this.$router.push('/login')
    },
    toggleOpen () {
      this.open = !this.open
    },
    async addAppointment () {
      const amountInCents = parseInt(this.amountInCents)
      if (this.customerName.length < 3 || amountInCents < 1 || amountInCents.toString() !== this.amountInCents || this.description.length < 3) {
        return
      }

      this.loading = true
      this.error = undefined

      // Get data
      const appointmentData = {
        businessId: this.$store.state.business.business.businessId,
        customerName: this.customerName,
        amountInCents,
        description: this.description
      }
      console.log(appointmentData)

      try {
        const appointment = await this.$axios.$post('http://tikkie-businesses.simonkarman.nl:17233/appointment', appointmentData)
        console.log(appointment)

        this.appointmentIds.push(appointment.appointmentId)

        this.customerName = ''
        this.amountInCents = '100'
        this.description = ''
        this.open = false
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
