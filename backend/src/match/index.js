const User = require('../../models/userSchema');
const userTransformer = require("../../transformers/user");

const handleMatchRoute = async (req, res, error) => {
    const currentUser = await User.findOne({_id: req.params.id});

    // Build query to select users
    const users = await User.find(matchQueryBuilder(currentUser));

    // Return users, transformed to remove any sensitive data
    return res.json({users: users.map(userTransformer)});
};

const matchQueryBuilder = (currentUser) => {
    const query = {_id: {$nin: [currentUser.likes, currentUser.dislikes]}};

    // Find additional query clauses based on gender/s.pref
    const criteria = findMatchCriteria(currentUser);

    // Apply additional criteria if we have it
    if (criteria) {
        query.gender = criteria.gender;
        query.sexualPreference = criteria.sexualPreference;
    }

    return query;
};

const findMatchCriteria = (currentUser) => {
    if (currentUser.gender === "Male" && currentUser.sexualPreference === "Straight") {
        return {gender: "Female", sexualPreference: "Straight"};
    }

    if (currentUser.gender === "Male" && currentUser.sexualPreference === "Gay") {
        return {gender: "Male", sexualPreference: "Gay"};
    }

    if (currentUser.gender === "Female" && currentUser.sexualPreference === "Straight") {
        return {gender: "Male", sexualPreference: "Straight"};
    }

    if (currentUser.gender === "Female" && currentUser.sexualPreference === "Lesbian") {
        return {gender: "Female", sexualPreference: "Lesbian"};
    }

    return null;
};

module.exports = {handleMatchRoute};
