const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Assessment extends Model {
    static associate(models) {
      Assessment.belongsTo(models.Batch, {
        foreignKey: "batch_id",
        as: "role",
      });
    }
  }

  Assessment.init(
    {
      assessment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      assessment_name: {
        type: DataTypes.STRING(70),
        allowNull: true,
      },
          no_of_questions:{
         type: DataTypes.INTEGER,
        allowNull: true,
      },
       is_questions:{
         type:DataTypes.BOOLEAN,
        allowNull:true
      },
      created_by: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },

      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      batch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "batch_tbl",
          key: "batch_id",
        },
      },
    },
    {
      sequelize,
      modelName: "Assessment",
      tableName: "assessment_tbl",
      timestamps: false,
    }
  );

  return Assessment;
};
