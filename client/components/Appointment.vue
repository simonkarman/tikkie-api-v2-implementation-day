<template>
  <div class="border container mx-auto bg-white mb-4 p-4">
    <div v-if="!loading">
      <span class="text-gray-500 float-right">{{ timestamp }}</span>
      <span class="font-bold text-xl">Appointment for {{ appointment.customerName }}</span><br>
      <span>
        Description: {{ appointment.description }}<br>
        Amount in Cents: {{ appointment.amountInCents }}<br>
        Tikkie: <a :href="appointment.tikkie.url" class="text-blue-600" target="_blank">{{ appointment.tikkie.url }}</a><br>
        Is paid: <span :class="!isPaid ? 'font-bold bg-red-300 p-1' : 'line-through'">No</span> / <span :class="isPaid ? 'font-bold bg-green-300 p-1' : 'line-through'">Yes</span>
      </span><br>
      <span class="text-gray-700 text-sm hidden">
        Raw Data: {{ appointment }}
      </span>
    </div>
    <div v-else>
      Loading Appointment <span class="font-bold"> {{ id }} </span> ...
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { default: 'none', type: String }
  },
  data: () => ({
    loading: true,
    appointment: {}
  }),
  // TODO: refresh this data
  mounted () {
    const interval = 5000
    const refresh = (that) => {
      const options = { headers: { 'X-Business-Id': that.$store.state.business.business.businessId } }
      this.$axios.$get(`http://tikkie-businesses.simonkarman.nl:17233/appointment/${that.id}`, options)
        .then((appointment, error) => {
          if (error) {
            console.log('Error while refreshing appointment: ', that.id, error)
            return
          }
          console.log('Refreshed appointment: ', that.id)
          this.appointment = appointment
          that.loading = false
          setTimeout(() => refresh(that), interval)
        })
    }

    // Start loop to refresh
    this.loading = true
    refresh(this)
  },
  computed: {
    isPaid () {
      return this.appointment.isPaid
    },
    timestamp () {
      return this.appointment.tikkie.createdDateTime
    }
  }
}
</script>
