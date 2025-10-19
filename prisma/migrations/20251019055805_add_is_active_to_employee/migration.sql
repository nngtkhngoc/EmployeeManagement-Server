-- CreateEnum
CREATE TYPE "WorkStatus" AS ENUM ('WORKING_ONSITE', 'WORK_FROM_HOME', 'BUSINESS_TRIP', 'TRAINING', 'ON_LEAVE_PERSONAL', 'ON_LEAVE_SICK', 'ON_LEAVE_MATERNITY', 'ON_LEAVE_VACATION', 'OFF_DUTY', 'ABSENT', 'RESIGNED', 'TERMINATED', 'RETIRED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "Education" AS ENUM ('HIGH_SCHOOL', 'ASSOCIATE_DEGREE', 'BACHELOR_DEGREE', 'MASTER_DEGREE', 'DOCTORATE_DEGREE', 'POST_DOCTORAL', 'VOCATIONAL_TRAINING', 'OTHER');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('PART_TIME', 'INTERNSHIP', 'PROBATION', 'TEMPORARY', 'FREELANCE', 'OUTSOURCE');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'PENDING', 'RENEWED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'NOT_APPROVED');

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "department_code" VARCHAR(4) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "founded_at" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "manager_id" INTEGER,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "employee_code" VARCHAR(5),
    "full_name" TEXT NOT NULL,
    "avatar" TEXT,
    "work_status" "WorkStatus" NOT NULL DEFAULT 'WORKING_ONSITE',
    "gender" "Gender" NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "citizen_id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ethnicity" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "education" "Education" NOT NULL,
    "major" TEXT NOT NULL,
    "si_no" TEXT NOT NULL,
    "hi_no" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "department_id" INTEGER,
    "position_id" INTEGER,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "contract_code" VARCHAR(10) NOT NULL,
    "type" "ContractType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "signed_date" TIMESTAMP(3) NOT NULL,
    "status" "ContractStatus" NOT NULL,
    "daily_salary" DECIMAL(65,30) NOT NULL,
    "allowance" DECIMAL(65,30) NOT NULL,
    "note" TEXT,
    "attachment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signed_by_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkHistory" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "WorkHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "max_days" INTEGER NOT NULL,

    CONSTRAINT "LeaveType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveApplication" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employee_id" INTEGER NOT NULL,
    "leave_type_id" INTEGER NOT NULL,

    CONSTRAINT "LeaveApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpdateRequest" (
    "id" SERIAL NOT NULL,
    "old_value" TEXT NOT NULL,
    "new_value" TEXT NOT NULL,
    "reason" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "requested_by_id" INTEGER NOT NULL,
    "reviewed_by_id" INTEGER NOT NULL,

    CONSTRAINT "UpdateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceReport" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceReportDetail" (
    "id" SERIAL NOT NULL,
    "leave_days" INTEGER NOT NULL DEFAULT 0,
    "over_leave_days" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employee_id" INTEGER NOT NULL,
    "attendance_report_id" INTEGER NOT NULL,

    CONSTRAINT "AttendanceReportDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceCriteria" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceReport" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceReportDetail" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "supervisor_id" INTEGER NOT NULL,
    "performance_report_id" INTEGER NOT NULL,

    CONSTRAINT "PerformanceReportDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceReportDetailScore" (
    "id" SERIAL NOT NULL,
    "performance_report_detail_id" INTEGER NOT NULL,
    "performance_criteria_id" INTEGER NOT NULL,

    CONSTRAINT "PerformanceReportDetailScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollReport" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayrollReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollReportDetail" (
    "id" SERIAL NOT NULL,
    "payroll_report_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "attendance_report_detail_id" INTEGER NOT NULL,
    "performance_report_detail_id" INTEGER NOT NULL,

    CONSTRAINT "PayrollReportDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_manager_id_key" ON "Department"("manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollReportDetail_attendance_report_detail_id_key" ON "PayrollReportDetail"("attendance_report_detail_id");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollReportDetail_performance_report_detail_id_key" ON "PayrollReportDetail"("performance_report_detail_id");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_signed_by_id_fkey" FOREIGN KEY ("signed_by_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkHistory" ADD CONSTRAINT "WorkHistory_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkHistory" ADD CONSTRAINT "WorkHistory_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "LeaveType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateRequest" ADD CONSTRAINT "UpdateRequest_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateRequest" ADD CONSTRAINT "UpdateRequest_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceReportDetail" ADD CONSTRAINT "AttendanceReportDetail_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceReportDetail" ADD CONSTRAINT "AttendanceReportDetail_attendance_report_id_fkey" FOREIGN KEY ("attendance_report_id") REFERENCES "AttendanceReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReportDetail" ADD CONSTRAINT "PerformanceReportDetail_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReportDetail" ADD CONSTRAINT "PerformanceReportDetail_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReportDetail" ADD CONSTRAINT "PerformanceReportDetail_performance_report_id_fkey" FOREIGN KEY ("performance_report_id") REFERENCES "PerformanceReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReportDetailScore" ADD CONSTRAINT "PerformanceReportDetailScore_performance_report_detail_id_fkey" FOREIGN KEY ("performance_report_detail_id") REFERENCES "PerformanceReportDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReportDetailScore" ADD CONSTRAINT "PerformanceReportDetailScore_performance_criteria_id_fkey" FOREIGN KEY ("performance_criteria_id") REFERENCES "PerformanceCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollReportDetail" ADD CONSTRAINT "PayrollReportDetail_payroll_report_id_fkey" FOREIGN KEY ("payroll_report_id") REFERENCES "PayrollReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollReportDetail" ADD CONSTRAINT "PayrollReportDetail_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollReportDetail" ADD CONSTRAINT "PayrollReportDetail_attendance_report_detail_id_fkey" FOREIGN KEY ("attendance_report_detail_id") REFERENCES "AttendanceReportDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollReportDetail" ADD CONSTRAINT "PayrollReportDetail_performance_report_detail_id_fkey" FOREIGN KEY ("performance_report_detail_id") REFERENCES "PerformanceReportDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
