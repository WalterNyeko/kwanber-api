const bcrypt = require('bcrypt');
const ValidateFields = require('../../helpers/validateField');
const generateToken = require('../../helpers/generateToken');

const Mutation = {
  register: async (_, {username, email, password }, { db })=> {
    ValidateFields(email, password);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return await db.query('INSERT INTO users(username, email, password) VALUES(?,?,?)',
      [username, email, hash]).then(()=>{
        return db.query(`SELECT username, email FROM users WHERE username=?`, [username])
    }
    ).spread(function (user) {
      return user[0];
    })
  },
   login: async (_, {username, email, password}, { db }) => {
    ValidateFields(email, password);
    const user = await db.query(`SELECT user_id, username, email, password FROM users WHERE email=?`, [email]);

    if (!user) throw Error('User not found');
    const match = await bcrypt.compare(password, user[0][0].password);
    if (!match) throw new Error('Incorrect password');
     const token = generateToken(user[0][0].email);
     return {
         jwtToken: token,
         email: user[0][0].email,
         username:user[0][0].username,
         user_id: user[0][0].user_id
     }
   },
   addRole: async (_, {name, description }, { db })=> {
    return await db.query('INSERT INTO roles(name, description) VALUES(?,?)',
      [name, description]).then(()=>{
        return db.query(`SELECT name, description FROM roles WHERE name=?`, [name])
    }
    ).spread(function (role) {
      return role[0];
    })
  },
  addUserRole: async (_, {user_id, role_id }, { db })=> {
    return await db.query('INSERT INTO users_roles(user_id, role_id) VALUES(?,?)',
      [user_id, role_id]).then(()=>{
        return db.query(`SELECT user_id, role_id FROM users_roles WHERE user_id=?`, [user_id])
    }
    ).spread(function (role) {
      return role[0];
    })
  },
};

module.exports = Mutation;