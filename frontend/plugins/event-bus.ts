import mitt from 'mitt'

export default defineNuxtPlugin((nuxtApp) => {
  const emitter = mitt()

    return {
      provide: {
        event: emitter.emit,
        listen: emitter.on,
      }
    }
})