import joi from 'joi'

const urlSchema = joi.object({
  link: joi.string().required()
})

export default urlSchema