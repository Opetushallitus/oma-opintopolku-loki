module.exports = {
  server: {
    command: `./node_modules/.bin/http-server -p ${process.env.TEST_PORT} dist`,
    port: parseInt(process.env.TEST_PORT)
  }
}
