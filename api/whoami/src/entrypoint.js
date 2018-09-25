module.exports.handler = (event, context, callback) => {

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
