import Joi from "joi";

export const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),

    password: Joi.string()
      .required(),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
  });

  return schema.validate({
    name: data.name,
    email: data.email,
    password: data.password,
  });
};

export const loginValidation = (data) => {

  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),

    password: Joi.string().required(),
  });

  return schema.validate({
    email: data.email,
    password: data.password,
  });
};