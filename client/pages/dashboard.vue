<template>
  <div class="bg-gray-200 min-h-screen">
    <div class="bg-gray-100 border-b mb-4">
      <div class="container mx-auto">
        <div class="p-4">
          <nuxt-link to="/login" class="float-right bg-red-500 text-white font-bold text-lg p-3 rounded" @click="logout">
            Logout
          </nuxt-link>
          <h1 class="text-xl font-bold">
            Dashboard of Tikkies for Businesses.
          </h1>
          <h2 class="text-gray-700">
            Welcome to your dashboard! You can find the status of all your appointments below!
          </h2>
        </div>
      </div>
    </div>
    <div class="container mx-auto bg-gray-100 mb-4 p-4">
      <div class="w-full font-bold text-lg" @click="toggleOpen">Create new appointment</div>
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

        <button class="my-4 bg-green-500 text-white font-bold text-lg p-1 rounded w-full" @click="addAppointment">Add appointment</button>
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
  asyncData () {
    // TODO on start fetch appointment ids
    return {
      open: false,
      customerName: '',
      amountInCents: '100',
      description: '',
      appointmentIds: ['a', 'b', 'c', 'd']
    }
  },
  methods: {
    logout () {
    },
    toggleOpen () {
      this.open = !this.open
    },
    addAppointment () {
      const amountInCents = parseInt(this.amountInCents)
      if (this.customerName.length < 3 || amountInCents < 1 || amountInCents.toString() !== this.amountInCents || this.description.length < 3) {
        return
      }

      const appointmentData = {
        customerName: this.customerName,
        amountInCents,
        description: this.description
      }
      this.customerName = ''
      this.amountInCents = ''
      this.description = ''
      console.log('appointment!', appointmentData)
    }
  }
}
</script>
