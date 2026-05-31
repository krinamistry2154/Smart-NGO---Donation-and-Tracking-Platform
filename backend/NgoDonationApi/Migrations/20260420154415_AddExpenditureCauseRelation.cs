using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NgoDonationApi.Migrations
{
    /// <inheritdoc />
    public partial class AddExpenditureCauseRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CauseId",
                table: "Expenditures",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ExpenditureId",
                table: "Expenditures",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Expenditures_CauseId",
                table: "Expenditures",
                column: "CauseId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenditures_Causes_CauseId",
                table: "Expenditures");

            migrationBuilder.DropForeignKey(
                name: "FK_Expenditures_Expenditures_ExpenditureId",
                table: "Expenditures");

            migrationBuilder.DropIndex(
                name: "IX_Expenditures_CauseId",
                table: "Expenditures");

            migrationBuilder.DropIndex(
                name: "IX_Expenditures_ExpenditureId",
                table: "Expenditures");

            migrationBuilder.DropColumn(
                name: "CauseId",
                table: "Expenditures");

            migrationBuilder.DropColumn(
                name: "ExpenditureId",
                table: "Expenditures");
        }
    }
}
