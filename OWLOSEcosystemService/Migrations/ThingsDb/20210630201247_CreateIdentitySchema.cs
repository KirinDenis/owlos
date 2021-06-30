using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OWLOSEcosystemService.Migrations.ThingsDb
{
    public partial class CreateIdentitySchema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ThingConnectionProperties",
                columns: table => new
                {
                    Id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HTTPEnable = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    HTTPStatus = table.Column<uint>(type: "int unsigned", nullable: false),
                    HTTPHost = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HTTPPort = table.Column<uint>(type: "int unsigned", nullable: false),
                    UARTEnable = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UARTStatus = table.Column<uint>(type: "int unsigned", nullable: false),
                    UARTPort = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UARTBaudRate = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThingConnectionProperties", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ThingDHTSensor",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Exists = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Celsius = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Temperature = table.Column<double>(type: "double", nullable: false),
                    TemperatureHistory = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Humidity = table.Column<double>(type: "double", nullable: false),
                    HumidityHistory = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HeatIndex = table.Column<double>(type: "double", nullable: false),
                    HeatIndexHistory = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThingDHTSensor", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ThingSensor",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Exists = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Value = table.Column<double>(type: "double", nullable: false),
                    ValueHistory = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThingSensor", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ThingAirQuality",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Status = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    QueryTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DHTSensorid = table.Column<int>(type: "int", nullable: true),
                    LightSensorid = table.Column<int>(type: "int", nullable: true),
                    MQ7Sensorid = table.Column<int>(type: "int", nullable: true),
                    TestAnalogSensorid = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThingAirQuality", x => x.id);
                    table.ForeignKey(
                        name: "FK_ThingAirQuality_ThingDHTSensor_DHTSensorid",
                        column: x => x.DHTSensorid,
                        principalTable: "ThingDHTSensor",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ThingAirQuality_ThingSensor_LightSensorid",
                        column: x => x.LightSensorid,
                        principalTable: "ThingSensor",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ThingAirQuality_ThingSensor_MQ7Sensorid",
                        column: x => x.MQ7Sensorid,
                        principalTable: "ThingSensor",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ThingAirQuality_ThingSensor_TestAnalogSensorid",
                        column: x => x.TestAnalogSensorid,
                        principalTable: "ThingSensor",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_DHTSensorid",
                table: "ThingAirQuality",
                column: "DHTSensorid");

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_LightSensorid",
                table: "ThingAirQuality",
                column: "LightSensorid");

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_MQ7Sensorid",
                table: "ThingAirQuality",
                column: "MQ7Sensorid");

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_TestAnalogSensorid",
                table: "ThingAirQuality",
                column: "TestAnalogSensorid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ThingAirQuality");

            migrationBuilder.DropTable(
                name: "ThingConnectionProperties");

            migrationBuilder.DropTable(
                name: "ThingDHTSensor");

            migrationBuilder.DropTable(
                name: "ThingSensor");
        }
    }
}
