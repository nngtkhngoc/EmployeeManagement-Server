import Joi from "joi";

const githubValidation = {
    inviteToRepo: {
        params: Joi.object({
            projectId: Joi.number().integer().positive().required(),
        }),
        body: Joi.object({
            employeeId: Joi.number().integer().positive().required(),
            githubUsername: Joi.string().trim().min(1).max(39).required(),
            permission: Joi.string()
                .valid("pull", "push", "admin", "maintain", "triage")
                .default("push"),
        }),
    },

    inviteBulk: {
        params: Joi.object({
            projectId: Joi.number().integer().positive().required(),
        }),
        body: Joi.object({
            invitations: Joi.array()
                .items(
                    Joi.object({
                        employeeId: Joi.number().integer().positive().required(),
                        githubUsername: Joi.string().trim().min(1).max(39).required(),
                        permission: Joi.string()
                            .valid("pull", "push", "admin", "maintain", "triage")
                            .default("push"),
                    })
                )
                .min(1)
                .max(50)
                .required(),
        }),
    },

    removeFromRepo: {
        params: Joi.object({
            projectId: Joi.number().integer().positive().required(),
        }),
        body: Joi.object({
            githubUsername: Joi.string().trim().min(1).max(39).required(),
        }),
    },
};

export default githubValidation;
