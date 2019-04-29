<script>
  const rconAddress = '127.0.0.1'
  const host = rconAddress.split(':')[0]

  function address () {
    return `http://${host}:38022`
  }

  function queryAddress () {
    return `http://127.0.0.1:7001`
  }
  export default {
    address,
    queryAddress
  }
</script>
