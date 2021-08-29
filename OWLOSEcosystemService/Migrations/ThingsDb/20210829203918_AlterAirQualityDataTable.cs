using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OWLOSEcosystemService.Migrations.ThingsDb
{
    public partial class AlterAirQualityDataTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThingAirQuality_ThingDHTSensor_DHTSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_LightSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_MotionSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_MQ7Sensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_ResistorSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropTable(
                name: "ThingDHTSensor");

            migrationBuilder.DropTable(
                name: "ThingSensor");

            migrationBuilder.DropIndex(
                name: "IX_ThingAirQuality_DHTSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropIndex(
                name: "IX_ThingAirQuality_LightSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropIndex(
                name: "IX_ThingAirQuality_MotionSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropIndex(
                name: "IX_ThingAirQuality_MQ7Sensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropIndex(
                name: "IX_ThingAirQuality_ResistorSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "DHTSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "LightSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "MQ7Sensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "MotionSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "ResistorSensorid",
                table: "ThingAirQuality");

            migrationBuilder.AddColumn<bool>(
                name: "ADS1X15",
                table: "ThingAirQuality",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<float>(
                name: "ADS1X15Light",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "ADS1X15Lighth",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "ADS1X15MQ135",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "ADS1X15MQ135h",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "ADS1X15MQ7",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "ADS1X15MQ7h",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "BMP280",
                table: "ThingAirQuality",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<float>(
                name: "BMP280altitude",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "BMP280altitudeh",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "BMP280pressure",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "BMP280pressureh",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "BMP280temperature",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "BMP280temperatureh",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "CCS811",
                table: "ThingAirQuality",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<float>(
                name: "CCS811CO2",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "CCS811CO2h",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "CCS811TVOC",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "CCS811TVOCh",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "CCS811resistence",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "CCS811resistenceh",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "CCS811temp",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "CCS811temph",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "DHT22",
                table: "ThingAirQuality",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "DHT22c",
                table: "ThingAirQuality",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<float>(
                name: "DHT22heat",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "DHT22heath",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "DHT22hum",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "DHT22humh",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "DHT22temp",
                table: "ThingAirQuality",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "DHT22temph",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ADS1X15",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "ADS1X15Light",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "ADS1X15Lighth",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "ADS1X15MQ135",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "ADS1X15MQ135h",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "ADS1X15MQ7",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "ADS1X15MQ7h",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "BMP280",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "BMP280altitude",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "BMP280altitudeh",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "BMP280pressure",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "BMP280pressureh",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "BMP280temperature",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "BMP280temperatureh",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "CCS811",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "CCS811CO2",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "CCS811CO2h",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "CCS811TVOC",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "CCS811TVOCh",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "CCS811resistence",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "CCS811resistenceh",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "CCS811temp",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "CCS811temph",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "DHT22",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "DHT22c",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "DHT22heat",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "DHT22heath",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "DHT22hum",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "DHT22humh",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "DHT22temp",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "DHT22temph",
                table: "ThingAirQuality");

            migrationBuilder.AddColumn<int>(
                name: "DHTSensorid",
                table: "ThingAirQuality",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LightSensorid",
                table: "ThingAirQuality",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MQ7Sensorid",
                table: "ThingAirQuality",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MotionSensorid",
                table: "ThingAirQuality",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ResistorSensorid",
                table: "ThingAirQuality",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ThingDHTSensor",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Celsius = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Exists = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    HeatIndex = table.Column<double>(type: "double", nullable: false),
                    HeatIndexHistory = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Humidity = table.Column<double>(type: "double", nullable: false),
                    HumidityHistory = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Temperature = table.Column<double>(type: "double", nullable: false),
                    TemperatureHistory = table.Column<string>(type: "longtext", nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_DHTSensorid",
                table: "ThingAirQuality",
                column: "DHTSensorid");

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_LightSensorid",
                table: "ThingAirQuality",
                column: "LightSensorid");

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_MotionSensorid",
                table: "ThingAirQuality",
                column: "MotionSensorid");

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_MQ7Sensorid",
                table: "ThingAirQuality",
                column: "MQ7Sensorid");

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_ResistorSensorid",
                table: "ThingAirQuality",
                column: "ResistorSensorid");

            migrationBuilder.AddForeignKey(
                name: "FK_ThingAirQuality_ThingDHTSensor_DHTSensorid",
                table: "ThingAirQuality",
                column: "DHTSensorid",
                principalTable: "ThingDHTSensor",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_LightSensorid",
                table: "ThingAirQuality",
                column: "LightSensorid",
                principalTable: "ThingSensor",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_MotionSensorid",
                table: "ThingAirQuality",
                column: "MotionSensorid",
                principalTable: "ThingSensor",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_MQ7Sensorid",
                table: "ThingAirQuality",
                column: "MQ7Sensorid",
                principalTable: "ThingSensor",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_ResistorSensorid",
                table: "ThingAirQuality",
                column: "ResistorSensorid",
                principalTable: "ThingSensor",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
