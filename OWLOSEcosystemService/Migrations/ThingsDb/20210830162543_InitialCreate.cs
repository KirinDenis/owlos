using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OWLOSEcosystemService.Migrations.ThingsDb
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ThingAirQuality",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Status = table.Column<int>(type: "int", nullable: false),
                    QueryTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DHT22 = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    DHT22hum = table.Column<float>(type: "float", nullable: false),
                    DHT22heat = table.Column<float>(type: "float", nullable: false),
                    DHT22c = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    BMP280 = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    BMP280pressure = table.Column<float>(type: "float", nullable: false),
                    BMP280altitude = table.Column<float>(type: "float", nullable: false),
                    BMP280temperature = table.Column<float>(type: "float", nullable: false),
                    ADS1X15 = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ADS1X15MQ135 = table.Column<float>(type: "float", nullable: false),
                    ADS1X15MQ7 = table.Column<float>(type: "float", nullable: false),
                    ADS1X15Light = table.Column<float>(type: "float", nullable: false),
                    CCS811 = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CCS811CO2 = table.Column<float>(type: "float", nullable: false),
                    CCS811TVOC = table.Column<float>(type: "float", nullable: false),
                    CCS811resistence = table.Column<float>(type: "float", nullable: false),
                    CCS811temp = table.Column<float>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThingAirQuality", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ThingConnectionProperties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Token = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ThingAirQuality");

            migrationBuilder.DropTable(
                name: "ThingConnectionProperties");
        }
    }
}
