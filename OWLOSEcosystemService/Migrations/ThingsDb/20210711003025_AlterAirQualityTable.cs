using Microsoft.EntityFrameworkCore.Migrations;

namespace OWLOSEcosystemService.Migrations.ThingsDb
{
    public partial class AlterAirQualityTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_TestAnalogSensorid",
                table: "ThingAirQuality");

            migrationBuilder.RenameColumn(
                name: "TestAnalogSensorid",
                table: "ThingAirQuality",
                newName: "ResistorSensorid");

            migrationBuilder.RenameIndex(
                name: "IX_ThingAirQuality_TestAnalogSensorid",
                table: "ThingAirQuality",
                newName: "IX_ThingAirQuality_ResistorSensorid");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "ThingAirQuality",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "MotionSensorid",
                table: "ThingAirQuality",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ThingAirQuality_MotionSensorid",
                table: "ThingAirQuality",
                column: "MotionSensorid");

            migrationBuilder.AddForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_MotionSensorid",
                table: "ThingAirQuality",
                column: "MotionSensorid",
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_MotionSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_ResistorSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropIndex(
                name: "IX_ThingAirQuality_MotionSensorid",
                table: "ThingAirQuality");

            migrationBuilder.DropColumn(
                name: "MotionSensorid",
                table: "ThingAirQuality");

            migrationBuilder.RenameColumn(
                name: "ResistorSensorid",
                table: "ThingAirQuality",
                newName: "TestAnalogSensorid");

            migrationBuilder.RenameIndex(
                name: "IX_ThingAirQuality_ResistorSensorid",
                table: "ThingAirQuality",
                newName: "IX_ThingAirQuality_TestAnalogSensorid");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "ThingAirQuality",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_ThingAirQuality_ThingSensor_TestAnalogSensorid",
                table: "ThingAirQuality",
                column: "TestAnalogSensorid",
                principalTable: "ThingSensor",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
