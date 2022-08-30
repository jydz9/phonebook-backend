const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const nameEnter = process.argv[3]
const numberEnter = process.argv[4]

const url = `mongodb+srv://Celestial:${password}@cluster0.uvhim2g.mongodb.net/phoneApp?retryWrites=true&w=majority`

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

mongoose.connect(url)
.then((result) => {
if(process.argv.length == 3){
  Phone
    .find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(info => {
        console.log(info.name, info.number)
      })
      console.log('close connection')
      return mongoose.connection.close()
    })
  }else{
    const phone = new Phone({
      name: nameEnter,
      number: numberEnter,
    })
    phone.save().then(() =>{
      console.log(`Added ${nameEnter} number ${numberEnter} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
  }
 })

// mongoose
//   .connect(url)
//   .then((result) => {
//     console.log('connected')

//     // Phone.find({}).then(result => {
//     //   result.forEach(note => {
//     //     console.log(note)
//     //   })
//     //   mongoose.connection.close()
//     // })
//     const phone = new Phone({
//         name: nameEnter,
//         number: numberEnter,
//     })

//     return phone.save()
//   })
//   .then(() => {
//     console.log('phone info saved!')
//     return mongoose.connection.close()
//   })
//   .catch((err) => console.log(err))