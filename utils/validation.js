import Joi from "joi";

export const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

    access_token: [Joi.string(), Joi.number()],

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
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });

  return schema.validate({
    email: data.email,
    password: data.password,
  });
};
