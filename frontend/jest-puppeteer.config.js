const defaultPort = 4200
const testPort = process.env.TEST_PORT || defaultPort

module.exports = {
  server: {
    command: `./node_modules/.bin/http-server -p ${testPort} dist`,
    port: parseInt(testPort)
  }
}
