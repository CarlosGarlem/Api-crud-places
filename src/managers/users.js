const userList = []

const getList = (req, res, next) => {
  res.status(200)
  res.json(userList)
}

const getOne = (req, res, next) => {
  const { id } = req.params

  if(id < 0) {
    res.status(400)
    res.send()
  }
  else if(id < userList.length) {
    res.status(200)
    res.json(userList[id])
  } else {
    res.status(404)
    res.send()
  }
}

module.exports = {
  userList,
  getList,
  getOne
}