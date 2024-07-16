const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Assessment extends Model {
    static associate(models) {
    //   Assessment.belongsTo(models.Questions, {
    //     foreignKey: "quns_id",
    //     as: "quns id",
    //   });
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
    //   quns_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true,
    //     references: {
    //       model: "Questions",
    //       key: "questions_tbl",
    //     },
    //   },
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
