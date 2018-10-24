const generateUUID = () => "ss-s-s-s-sss".replace(/s/g, s4)

const s4 = () => (
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
)
