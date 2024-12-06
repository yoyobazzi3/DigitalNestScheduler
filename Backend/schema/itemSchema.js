import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brandname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
}, {
  tableName: 'items',
  timestamps: false, // Disable createdAt and updatedAt fields
});

export default Item;
