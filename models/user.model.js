const bcrypt = require('bcrypt-nodejs')

function UserModel(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      },
      set(val) {
        this.setDataValue('email', val.toLowerCase())
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
	      len: [6, 100]
      }
    },
    name: DataTypes.STRING,
    fbID: DataTypes.STRING,
    fbToken: DataTypes.STRING,
    authMethod: {
			type: DataTypes.STRING,
			allowNull: false
    },
    status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'ACTIVE'
    }
  }, {
    tableName: 'users',
    instanceMethods: {
      comparePasswords(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
          if (err) {
            return cb(err);
          }

          cb(null, isMatch);
        });
      }
    }
  });

  User.beforeCreate(hashPasswordHook);
  User.beforeUpdate(hashPasswordHook);

  return User;
}

function hashPasswordHook(user, options, cb) {
  if (!user.changed('password')) {
    return cb(null, options);
  }

  // generate salt
  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return cb(err);
    }

    // hash raw password with salt
    return bcrypt.hash(user.get('password'), salt, null, (err, hash) => {
      if (err) {
        return cb(err);
      }

      user.password = hash;
      cb(null, options);
    });
  });
}

module.exports = UserModel;
