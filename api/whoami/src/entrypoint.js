const config = require('config');
const UserClient = require('../../common/UserClient')

module.exports.handler = async (event, context, callback) => {

  try {
    const { secret, hetu, oid } = event.headers
    console.log(JSON.stringify({message: `Received whoami request for ${oid}`}))

    const userClient = new UserClient(
      config.get('backend.timeout'),
      config.get('backend.host'),
      config.get('secret.name')
    )

    const user = await userClient.getUser(hetu)

    callback(null, {
      statusCode: 200,
      headers: {
        'Cache-Control': 'max-age=600'
      },
      body: JSON.stringify(user)
    })
  } catch (err) {
    console.log('Failed', err)
  }
}
