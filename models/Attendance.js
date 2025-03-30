const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  checkInTime: { type: DataTypes.DATE, allowNull: true },
  checkOutTime: { type: DataTypes.DATE, allowNull: true },
  faceVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

User.hasMany(Attendance, { foreignKey: 'userId' });
Attendance.belongsTo(User, { foreignKey: 'userId' });

module.exports = Attendance;
