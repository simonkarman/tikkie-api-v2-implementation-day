<template>
  <div class="border container mx-auto bg-white mb-4 p-4">
    <div v-if="loaded">
      <span class="text-gray-500 float-right">{{ timestamp }}</span>
      <span class="font-bold text-xl">Appointment for {{ id }}</span><br>
      <span>
        Payment RequestId: {{ paymentRequestId }} <br>
        Is paid: <span :class="!isPaid ? 'font-bold' : 'line-through'">No</span> / <span :class="isPaid ? 'font-bold' : 'line-through'">Yes</span>
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
  asyncData () {
    // TODO on start fetch appointment information
    return {
      paymentRequestId: 'pr-kealdfk3l22',
      isPaid: false,
      timestamp: '2020-05-20 13:37:00',
      loaded: true
    }
  }
}
</script>
