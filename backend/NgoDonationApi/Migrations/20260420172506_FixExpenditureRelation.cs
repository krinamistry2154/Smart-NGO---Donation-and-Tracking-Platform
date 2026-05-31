using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NgoDonationApi.Migrations
{
    /// <inheritdoc />
    public partial class FixExpenditureRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenditures_Causes_CauseId",
                table: "Expenditures");

            migrationBuilder.DropForeignKey(
                name: "FK_Expenditures_Expenditures_ExpenditureId",
                table: "Expenditures");

            migrationBuilder.DropIndex(
                name: "IX_Expenditures_ExpenditureId",
                table: "Expenditures");

            migrationBuilder.DropColumn(
                name: "ExpenditureId",
                table: "Expenditures");

            migrationBuilder.AlterColumn<int>(
                name: "CauseId",
                table: "Expenditures",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenditures_Causes_CauseId",
                table: "Expenditures",
                column: "CauseId",
                principalTable: "Causes",
                principalColumn: "CauseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenditures_Causes_CauseId",
                table: "Expenditures");

            migrationBuilder.AlterColumn<int>(
                name: "CauseId",
                table: "Expenditures",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExpenditureId",
                table: "Expenditures",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Expenditures_ExpenditureId",
                table: "Expenditures",
                column: "ExpenditureId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenditures_Causes_CauseId",
                table: "Expenditures",
                column: "CauseId",
                principalTable: "Causes",
                principalColumn: "CauseId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Expenditures_Expenditures_ExpenditureId",
                table: "Expenditures",
                column: "ExpenditureId",
                principalTable: "Expenditures",
                principalColumn: "Id");
        }
    }
}
