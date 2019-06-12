const Query = {
    allUsers: (_, __, { db}) => {
        return db.query(
            'SELECT * FROM users'
        ).spread(function (users) {
            return users;
        })
    },
    allRoles: (_, __, { db}) => {
        return db.query(
          'SELECT * FROM roles'
        ).spread(function (roles) {
          return roles;
        })
      },
    allUsersRoles: (_, __, { db}) => {
        return db.query(
            'SELECT * FROM users_roles'
        ).spread(function (roles) {
            return roles;
        })
    },

    eachUserRoles: async (_, { user_id }, { db}) => {
        return db.query(
            `SELECT * FROM users_roles WHERE user_id=?`, [user_id]
        ).spread(function (roles) {
            return roles;
        });
    }
        
  };
  
  module.exports = Query;