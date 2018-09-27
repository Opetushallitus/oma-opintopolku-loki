const UserClient = require('../../common/client')

module.exports.handler = async (event, context, callback) => {

  try {
    const jooh = await UserClient({
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    }, '070598-6593')

    console.log(jooh.data)
  } catch (err) {
    console.log('Failed', err)
  }

  const { firstname, sn: lastname, oid } = event.headers
  console.log(JSON.stringify({message: `Received whoami request for ${oid}`}))

  callback(null, {
    statusCode: 200,
    headers: {
      'Cache-Control': 'max-age=600'
    },
    body: JSON.stringify({
      firstname,
      lastname,
      oid
    })
  })
}
