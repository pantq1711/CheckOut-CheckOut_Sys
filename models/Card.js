const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Card = sequelize.define('Card', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cardId: { type: DataTypes.STRING, unique: true, allowNull: false },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

User.hasOne(Card, { foreignKey: 'userId' });
Card.belongsTo(User, { foreignKey: 'userId' });

module.exports = Card;
