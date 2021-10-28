const userTransformer = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        sexualPreference: user.sexualPreference,
        age: user.age,
        description: user.description,
        path: user.path,
    }
};

module.exports = userTransformer;
