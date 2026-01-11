import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../config/bcrypt.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🗑️  Clearing existing data...");
  
  // Delete in reverse order of dependencies
  await prisma.notificationRecipient.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.timeKeepingReportDetail.deleteMany();
  await prisma.timeKeepingReport.deleteMany();
  await prisma.overTime.deleteMany();
  await prisma.payrollReportDetail.deleteMany();
  await prisma.payrollReport.deleteMany();
  await prisma.performanceReportDetailScore.deleteMany();
  await prisma.performanceReportDetail.deleteMany();
  await prisma.performanceReport.deleteMany();
  await prisma.performanceCriteria.deleteMany();
  await prisma.attendanceReportDetail.deleteMany();
  await prisma.attendanceReport.deleteMany();
  await prisma.updateRequest.deleteMany();
  await prisma.leaveApplication.deleteMany();
  await prisma.leaveType.deleteMany();
  await prisma.workHistory.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.position.deleteMany();
  await prisma.department.deleteMany();

  console.log("✅ Existing data cleared");

  // 1. Create Departments
  console.log("📁 Creating departments...");
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        departmentCode: "IT",
        name: "Information Technology",
        foundedAt: new Date("2020-01-15"),
        description: "IT Department responsible for software development and infrastructure",
      },
    }),
    prisma.department.create({
      data: {
        departmentCode: "HR",
        name: "Human Resources",
        foundedAt: new Date("2020-02-01"),
        description: "HR Department managing employees and recruitment",
      },
    }),
    prisma.department.create({
      data: {
        departmentCode: "FIN",
        name: "Finance",
        foundedAt: new Date("2020-02-15"),
        description: "Finance Department handling accounting and budgets",
      },
    }),
    prisma.department.create({
      data: {
        departmentCode: "MKT",
        name: "Marketing",
        foundedAt: new Date("2020-03-01"),
        description: "Marketing Department for brand and campaigns",
      },
    }),
    prisma.department.create({
      data: {
        departmentCode: "OPS",
        name: "Operations",
        foundedAt: new Date("2020-03-15"),
        description: "Operations Department for day-to-day business operations",
      },
    }),
  ]);
  console.log(`✅ Created ${departments.length} departments`);

  // 2. Create Positions
  console.log("💼 Creating positions...");
  const positions = await Promise.all([
    prisma.position.create({
      data: { name: "Software Engineer" },
    }),
    prisma.position.create({
      data: { name: "Senior Software Engineer" },
    }),
    prisma.position.create({
      data: { name: "Team Lead" },
    }),
    prisma.position.create({
      data: { name: "Manager" },
    }),
    prisma.position.create({
      data: { name: "HR Specialist" },
    }),
    prisma.position.create({
      data: { name: "HR Manager" },
    }),
    prisma.position.create({
      data: { name: "Accountant" },
    }),
    prisma.position.create({
      data: { name: "Finance Manager" },
    }),
    prisma.position.create({
      data: { name: "Marketing Specialist" },
    }),
    prisma.position.create({
      data: { name: "Operations Manager" },
    }),
  ]);
  console.log(`✅ Created ${positions.length} positions`);

  // 3. Create Employees
  console.log("👥 Creating employees...");
  const defaultPassword = "123456";
  const hashedPassword = await hashPassword(defaultPassword);
  
  const employees = await Promise.all([
    // IT Department Employees
    prisma.employee.create({
      data: {
        employeeCode: "EMP01",
        fullName: "Nguyen Van A",
        gender: "MALE",
        birthday: new Date("1990-05-15"),
        citizenId: "001234567890",
        phone: "0901234567",
        email: "nguyenvana@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "BACHELOR_DEGREE",
        major: "Computer Science",
        siNo: "1234567890",
        hiNo: "0987654321",
        password: hashedPassword,
        departmentId: departments[0].id,
        positionId: positions[1].id, // Senior Software Engineer
        role: "Manager",
        isActive: true,
        workStatus: "WORKING_ONSITE",
      },
    }),
    prisma.employee.create({
      data: {
        employeeCode: "EMP02",
        fullName: "Tran Thi B",
        gender: "FEMALE",
        birthday: new Date("1992-08-20"),
        citizenId: "001234567891",
        phone: "0901234568",
        email: "tranthib@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "BACHELOR_DEGREE",
        major: "Information Technology",
        siNo: "1234567891",
        hiNo: "0987654322",
        password: hashedPassword,
        departmentId: departments[0].id,
        positionId: positions[0].id, // Software Engineer
        role: "Employee",
        isActive: true,
        workStatus: "WORKING_ONSITE",
      },
    }),
    prisma.employee.create({
      data: {
        employeeCode: "EMP03",
        fullName: "Le Van C",
        gender: "MALE",
        birthday: new Date("1988-03-10"),
        citizenId: "001234567892",
        phone: "0901234569",
        email: "levanc@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "MASTER_DEGREE",
        major: "Software Engineering",
        siNo: "1234567892",
        hiNo: "0987654323",
        password: hashedPassword,
        departmentId: departments[0].id,
        positionId: positions[2].id, // Team Lead
        role: "Manager",
        isActive: true,
        workStatus: "WORKING_ONSITE",
      },
    }),
    // HR Department Employees
    prisma.employee.create({
      data: {
        employeeCode: "EMP04",
        fullName: "Pham Thi D",
        gender: "FEMALE",
        birthday: new Date("1985-12-05"),
        citizenId: "001234567893",
        phone: "0901234570",
        email: "phamthid@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "BACHELOR_DEGREE",
        major: "Human Resources",
        siNo: "1234567893",
        hiNo: "0987654324",
        password: hashedPassword,
        departmentId: departments[1].id,
        positionId: positions[5].id, // HR Manager
        role: "Manager",
        isActive: true,
        workStatus: "WORKING_ONSITE",
      },
    }),
    prisma.employee.create({
      data: {
        employeeCode: "EMP05",
        fullName: "Hoang Van E",
        gender: "MALE",
        birthday: new Date("1993-07-25"),
        citizenId: "001234567894",
        phone: "0901234571",
        email: "hoangvane@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "BACHELOR_DEGREE",
        major: "Business Administration",
        siNo: "1234567894",
        hiNo: "0987654325",
        password: hashedPassword,
        departmentId: departments[1].id,
        positionId: positions[4].id, // HR Specialist
        role: "Employee",
        isActive: true,
        workStatus: "WORKING_ONSITE",
      },
    }),
    // Finance Department Employees
    prisma.employee.create({
      data: {
        employeeCode: "EMP06",
        fullName: "Vu Thi F",
        gender: "FEMALE",
        birthday: new Date("1987-09-30"),
        citizenId: "001234567895",
        phone: "0901234572",
        email: "vuthif@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "BACHELOR_DEGREE",
        major: "Accounting",
        siNo: "1234567895",
        hiNo: "0987654326",
        password: hashedPassword,
        departmentId: departments[2].id,
        positionId: positions[7].id, // Finance Manager
        role: "Manager",
        isActive: true,
        workStatus: "WORKING_ONSITE",
      },
    }),
    prisma.employee.create({
      data: {
        employeeCode: "EMP07",
        fullName: "Do Van G",
        gender: "MALE",
        birthday: new Date("1991-04-18"),
        citizenId: "001234567896",
        phone: "0901234573",
        email: "dovang@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "BACHELOR_DEGREE",
        major: "Finance",
        siNo: "1234567896",
        hiNo: "0987654327",
        password: hashedPassword,
        departmentId: departments[2].id,
        positionId: positions[6].id, // Accountant
        role: "Employee",
        isActive: true,
        workStatus: "WORKING_ONSITE",
      },
    }),
    // Marketing Department Employees
    prisma.employee.create({
      data: {
        employeeCode: "EMP08",
        fullName: "Bui Thi H",
        gender: "FEMALE",
        birthday: new Date("1994-11-12"),
        citizenId: "001234567897",
        phone: "0901234574",
        email: "buithih@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "BACHELOR_DEGREE",
        major: "Marketing",
        siNo: "1234567897",
        hiNo: "0987654328",
        password: hashedPassword,
        departmentId: departments[3].id,
        positionId: positions[8].id, // Marketing Specialist
        role: "Employee",
        isActive: true,
        workStatus: "WORK_FROM_HOME",
      },
    }),
    // Operations Department Employees
    prisma.employee.create({
      data: {
        employeeCode: "EMP09",
        fullName: "Ngo Van I",
        gender: "MALE",
        birthday: new Date("1986-06-22"),
        citizenId: "001234567898",
        phone: "0901234575",
        email: "ngovani@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "BACHELOR_DEGREE",
        major: "Business Management",
        siNo: "1234567898",
        hiNo: "0987654329",
        password: hashedPassword,
        departmentId: departments[4].id,
        positionId: positions[9].id, // Operations Manager
        role: "Manager",
        isActive: true,
        workStatus: "WORKING_ONSITE",
      },
    }),
    prisma.employee.create({
      data: {
        employeeCode: "EMP10",
        fullName: "Dao Thi K",
        gender: "FEMALE",
        birthday: new Date("1995-01-28"),
        citizenId: "001234567899",
        phone: "0901234576",
        email: "daothik@example.com",
        ethnicity: "Kinh",
        religion: "None",
        education: "BACHELOR_DEGREE",
        major: "Operations Management",
        siNo: "1234567899",
        hiNo: "0987654330",
        password: hashedPassword,
        departmentId: departments[4].id,
        positionId: positions[0].id, // Software Engineer
        role: "Employee",
        isActive: true,
        workStatus: "WORKING_ONSITE",
      },
    }),
  ]);
  console.log(`✅ Created ${employees.length} employees`);

  // Update department managers
  await prisma.department.update({
    where: { id: departments[0].id },
    data: { managerId: employees[0].id }, // IT Manager
  });
  await prisma.department.update({
    where: { id: departments[1].id },
    data: { managerId: employees[3].id }, // HR Manager
  });
  await prisma.department.update({
    where: { id: departments[2].id },
    data: { managerId: employees[5].id }, // Finance Manager
  });
  await prisma.department.update({
    where: { id: departments[4].id },
    data: { managerId: employees[8].id }, // Operations Manager
  });

  // 4. Create Leave Types
  console.log("📋 Creating leave types...");
  const leaveTypes = await Promise.all([
    prisma.leaveType.create({
      data: {
        name: "Annual Leave",
        maxDays: 12,
      },
    }),
    prisma.leaveType.create({
      data: {
        name: "Sick Leave",
        maxDays: 5,
      },
    }),
    prisma.leaveType.create({
      data: {
        name: "Personal Leave",
        maxDays: 3,
      },
    }),
    prisma.leaveType.create({
      data: {
        name: "Maternity Leave",
        maxDays: 180,
      },
    }),
  ]);
  console.log(`✅ Created ${leaveTypes.length} leave types`);

  // 5. Create Contracts
  console.log("📝 Creating contracts...");
  const contracts = await Promise.all([
    prisma.contract.create({
      data: {
        contractCode: "CT001",
        type: "FULL_TIME",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2025-12-31"),
        signedDate: new Date("2022-12-15"),
        status: "ACTIVE",
        dailySalary: 500000,
        allowance: 2000000,
        note: "Full-time contract",
        employeeId: employees[0].id,
        signedById: employees[3].id, // HR Manager
      },
    }),
    prisma.contract.create({
      data: {
        contractCode: "CT002",
        type: "FULL_TIME",
        startDate: new Date("2023-06-01"),
        endDate: new Date("2026-05-31"),
        signedDate: new Date("2023-05-20"),
        status: "ACTIVE",
        dailySalary: 450000,
        allowance: 1500000,
        note: "Full-time contract",
        employeeId: employees[1].id,
        signedById: employees[3].id, // HR Manager
      },
    }),
    prisma.contract.create({
      data: {
        contractCode: "CT003",
        type: "FULL_TIME",
        startDate: new Date("2022-03-01"),
        endDate: new Date("2024-02-29"),
        signedDate: new Date("2022-02-20"),
        status: "EXPIRED",
        dailySalary: 600000,
        allowance: 2500000,
        note: "Expired contract",
        employeeId: employees[2].id,
        signedById: employees[3].id, // HR Manager
      },
    }),
    prisma.contract.create({
      data: {
        contractCode: "CT004",
        type: "FULL_TIME",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2026-12-31"),
        signedDate: new Date("2023-12-15"),
        status: "ACTIVE",
        dailySalary: 550000,
        allowance: 2000000,
        note: "Renewed contract",
        employeeId: employees[2].id,
        signedById: employees[3].id, // HR Manager
      },
    }),
  ]);
  console.log(`✅ Created ${contracts.length} contracts`);

  // 6. Create Work History
  console.log("📚 Creating work history...");
  const workHistories = await Promise.all([
    prisma.workHistory.create({
      data: {
        startDate: new Date("2023-01-01"),
        endDate: null, // Current position
        note: "Started as Senior Software Engineer",
        employeeId: employees[0].id,
        departmentId: departments[0].id,
        positionId: positions[1].id,
      },
    }),
    prisma.workHistory.create({
      data: {
        startDate: new Date("2023-06-01"),
        endDate: null,
        note: "Started as Software Engineer",
        employeeId: employees[1].id,
        departmentId: departments[0].id,
        positionId: positions[0].id,
      },
    }),
    prisma.workHistory.create({
      data: {
        startDate: new Date("2022-03-01"),
        endDate: new Date("2023-12-31"),
        note: "Previous position",
        employeeId: employees[2].id,
        departmentId: departments[0].id,
        positionId: positions[0].id,
      },
    }),
    prisma.workHistory.create({
      data: {
        startDate: new Date("2024-01-01"),
        endDate: null,
        note: "Promoted to Team Lead",
        employeeId: employees[2].id,
        departmentId: departments[0].id,
        positionId: positions[2].id,
      },
    }),
  ]);
  console.log(`✅ Created ${workHistories.length} work histories`);

  // 7. Create Leave Applications
  console.log("🏖️  Creating leave applications...");
  const leaveApplications = await Promise.all([
    prisma.leaveApplication.create({
      data: {
        startDate: new Date("2024-12-20"),
        endDate: new Date("2024-12-22"),
        reason: "Annual vacation",
        status: "APPROVED",
        employeeId: employees[0].id,
        leaveTypeId: leaveTypes[0].id, // Annual Leave
      },
    }),
    prisma.leaveApplication.create({
      data: {
        startDate: new Date("2024-12-25"),
        endDate: new Date("2024-12-26"),
        reason: "Sick leave",
        status: "PENDING",
        employeeId: employees[1].id,
        leaveTypeId: leaveTypes[1].id, // Sick Leave
      },
    }),
    prisma.leaveApplication.create({
      data: {
        startDate: new Date("2025-01-05"),
        endDate: new Date("2025-01-07"),
        reason: "Personal matters",
        status: "APPROVED",
        employeeId: employees[2].id,
        leaveTypeId: leaveTypes[2].id, // Personal Leave
      },
    }),
  ]);
  console.log(`✅ Created ${leaveApplications.length} leave applications`);

  // 8. Create Update Requests
  console.log("📝 Creating update requests...");
  const updateRequests = await Promise.all([
    prisma.updateRequest.create({
      data: {
        content: "Request to update email address to new email",
        status: "PENDING",
        requestedById: employees[0].id,
        updated_at: new Date(),
      },
    }),
    prisma.updateRequest.create({
      data: {
        content: "Request to update phone number",
        status: "APPROVED",
        requestedById: employees[1].id,
        reviewedById: employees[3].id, // HR Manager
        updated_at: new Date(),
      },
    }),
    prisma.updateRequest.create({
      data: {
        content: "Request to update address information",
        status: "NOT_APPROVED",
        requestedById: employees[2].id,
        reviewedById: employees[3].id, // HR Manager
        updated_at: new Date(),
      },
    }),
    prisma.updateRequest.create({
      data: {
        content: "Request to change department",
        status: "PENDING",
        requestedById: employees[4].id,
        updated_at: new Date(),
      },
    }),
    prisma.updateRequest.create({
      data: {
        content: "Request to update bank account information",
        status: "PENDING",
        requestedById: employees[5].id,
        updated_at: new Date(),
      },
    }),
  ]);
  console.log(`✅ Created ${updateRequests.length} update requests`);

  // 9. Create Performance Criteria
  console.log("⭐ Creating performance criteria...");
  const performanceCriterias = await Promise.all([
    prisma.performanceCriteria.create({
      data: {
        name: "Productivity",
        description: "Employee productivity and output quality",
      },
    }),
    prisma.performanceCriteria.create({
      data: {
        name: "Teamwork",
        description: "Collaboration and teamwork skills",
      },
    }),
    prisma.performanceCriteria.create({
      data: {
        name: "Communication",
        description: "Communication and presentation skills",
      },
    }),
    prisma.performanceCriteria.create({
      data: {
        name: "Problem Solving",
        description: "Ability to solve problems and make decisions",
      },
    }),
    prisma.performanceCriteria.create({
      data: {
        name: "Leadership",
        description: "Leadership and management capabilities",
      },
    }),
  ]);
  console.log(`✅ Created ${performanceCriterias.length} performance criteria`);

  // 10. Create Attendance Reports
  console.log("📊 Creating attendance reports...");
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const attendanceReports = await Promise.all([
    prisma.attendanceReport.create({
      data: {
        month: lastMonth,
        year: lastMonthYear,
      },
    }),
    prisma.attendanceReport.create({
      data: {
        month: currentMonth,
        year: currentYear,
      },
    }),
  ]);
  console.log(`✅ Created ${attendanceReports.length} attendance reports`);

  // 11. Create Attendance Report Details
  console.log("📋 Creating attendance report details...");
  const attendanceReportDetails = await Promise.all([
    prisma.attendanceReportDetail.create({
      data: {
        leaveDays: 2,
        overLeaveDays: 0,
        note: "Good attendance",
        employeeId: employees[0].id,
        attendanceReportId: attendanceReports[0].id,
      },
    }),
    prisma.attendanceReportDetail.create({
      data: {
        leaveDays: 1,
        overLeaveDays: 0,
        note: "Good attendance",
        employeeId: employees[1].id,
        attendanceReportId: attendanceReports[0].id,
      },
    }),
    prisma.attendanceReportDetail.create({
      data: {
        leaveDays: 0,
        overLeaveDays: 0,
        note: "Perfect attendance",
        employeeId: employees[2].id,
        attendanceReportId: attendanceReports[0].id,
      },
    }),
    prisma.attendanceReportDetail.create({
      data: {
        leaveDays: 3,
        overLeaveDays: 1,
        note: "Some leave days",
        employeeId: employees[0].id,
        attendanceReportId: attendanceReports[1].id,
      },
    }),
  ]);
  console.log(`✅ Created ${attendanceReportDetails.length} attendance report details`);

  // 12. Create Performance Reports
  console.log("📈 Creating performance reports...");
  const performanceReports = await Promise.all([
    prisma.performanceReport.create({
      data: {
        month: lastMonth,
        year: lastMonthYear,
      },
    }),
    prisma.performanceReport.create({
      data: {
        month: currentMonth,
        year: currentYear,
      },
    }),
  ]);
  console.log(`✅ Created ${performanceReports.length} performance reports`);

  // 13. Create Performance Report Details
  console.log("📊 Creating performance report details...");
  const performanceReportDetails = await Promise.all([
    prisma.performanceReportDetail.create({
      data: {
        employeeId: employees[0].id,
        supervisorId: employees[2].id, // Team Lead
        performanceReportId: performanceReports[0].id,
        average_score: 4.5,
      },
    }),
    prisma.performanceReportDetail.create({
      data: {
        employeeId: employees[1].id,
        supervisorId: employees[2].id, // Team Lead
        performanceReportId: performanceReports[0].id,
        average_score: 4.2,
      },
    }),
    prisma.performanceReportDetail.create({
      data: {
        employeeId: employees[0].id,
        supervisorId: employees[2].id, // Team Lead
        performanceReportId: performanceReports[1].id,
        average_score: 4.7,
      },
    }),
  ]);
  console.log(`✅ Created ${performanceReportDetails.length} performance report details`);

  // 14. Create Performance Report Detail Scores
  console.log("⭐ Creating performance scores...");
  const performanceScores = await Promise.all([
    // Scores for employee 0, report 0
    prisma.performanceReportDetailScore.create({
      data: {
        performanceReportDetailId: performanceReportDetails[0].id,
        performanceCriteriaId: performanceCriterias[0].id,
        score: 4.5,
      },
    }),
    prisma.performanceReportDetailScore.create({
      data: {
        performanceReportDetailId: performanceReportDetails[0].id,
        performanceCriteriaId: performanceCriterias[1].id,
        score: 4.5,
      },
    }),
    prisma.performanceReportDetailScore.create({
      data: {
        performanceReportDetailId: performanceReportDetails[0].id,
        performanceCriteriaId: performanceCriterias[2].id,
        score: 4.5,
      },
    }),
    // Scores for employee 1, report 0
    prisma.performanceReportDetailScore.create({
      data: {
        performanceReportDetailId: performanceReportDetails[1].id,
        performanceCriteriaId: performanceCriterias[0].id,
        score: 4.2,
      },
    }),
    prisma.performanceReportDetailScore.create({
      data: {
        performanceReportDetailId: performanceReportDetails[1].id,
        performanceCriteriaId: performanceCriterias[1].id,
        score: 4.3,
      },
    }),
  ]);
  console.log(`✅ Created ${performanceScores.length} performance scores`);

  // 15. Create Payroll Reports
  console.log("💰 Creating payroll reports...");
  const payrollReports = await Promise.all([
    prisma.payrollReport.create({
      data: {
        month: lastMonth,
        year: lastMonthYear,
      },
    }),
    prisma.payrollReport.create({
      data: {
        month: currentMonth,
        year: currentYear,
      },
    }),
  ]);
  console.log(`✅ Created ${payrollReports.length} payroll reports`);

  // 16. Create Payroll Report Details
  console.log("💵 Creating payroll report details...");
  const payrollReportDetails = await Promise.all([
    prisma.payrollReportDetail.create({
      data: {
        payrollReportId: payrollReports[0].id,
        employeeId: employees[0].id,
        attendanceReportDetailId: attendanceReportDetails[0].id,
        performanceReportDetailId: performanceReportDetails[0].id,
        basicSalary: 15000000,
        allowances: 2000000,
        deductions: 0,
        performanceRatio: 4.5,
        totalSalary: 17000000,
      },
    }),
    prisma.payrollReportDetail.create({
      data: {
        payrollReportId: payrollReports[0].id,
        employeeId: employees[1].id,
        attendanceReportDetailId: attendanceReportDetails[1].id,
        performanceReportDetailId: performanceReportDetails[1].id,
        basicSalary: 13500000,
        allowances: 1500000,
        deductions: 0,
        performanceRatio: 4.2,
        totalSalary: 15000000,
      },
    }),
  ]);
  console.log(`✅ Created ${payrollReportDetails.length} payroll report details`);

  // 17. Create OverTime
  console.log("⏰ Creating overtime records...");
  const overtimes = await Promise.all([
    prisma.overTime.create({
      data: {
        employee_id: employees[0].id,
        hour: 2,
        status: "APPROVED",
        overTimeDate: new Date("2024-12-15"),
        approved_by_id: employees[2].id, // Team Lead
        created_at: new Date("2024-12-14"),
      },
    }),
    prisma.overTime.create({
      data: {
        employee_id: employees[1].id,
        hour: 4,
        status: "PENDING",
        overTimeDate: new Date("2024-12-16"),
        approved_by_id: employees[2].id, // Team Lead
        created_at: new Date("2024-12-15"),
      },
    }),
    prisma.overTime.create({
      data: {
        employee_id: employees[2].id,
        hour: 3,
        status: "APPROVED",
        overTimeDate: new Date("2024-12-10"),
        approved_by_id: employees[0].id, // Manager
        created_at: new Date("2024-12-09"),
      },
    }),
  ]);
  console.log(`✅ Created ${overtimes.length} overtime records`);

  // 18. Create Time Keeping Reports
  console.log("🕐 Creating time keeping reports...");
  const timeKeepingReports = await Promise.all([
    prisma.timeKeepingReport.create({
      data: {
        month: lastMonth,
        year: lastMonthYear,
      },
    }),
    prisma.timeKeepingReport.create({
      data: {
        month: currentMonth,
        year: currentYear,
      },
    }),
  ]);
  console.log(`✅ Created ${timeKeepingReports.length} time keeping reports`);

  // 19. Create Time Keeping Report Details
  console.log("🕑 Creating time keeping report details...");
  const timeKeepingDetails = await Promise.all([
    prisma.timeKeepingReportDetail.create({
      data: {
        employee_id: employees[0].id,
        timeIn: new Date(`2024-${String(lastMonth).padStart(2, "0")}-01T08:00:00Z`),
        timeOut: new Date(`2024-${String(lastMonth).padStart(2, "0")}-01T17:00:00Z`),
        report_id: timeKeepingReports[0].id,
      },
    }),
    prisma.timeKeepingReportDetail.create({
      data: {
        employee_id: employees[1].id,
        timeIn: new Date(`2024-${String(lastMonth).padStart(2, "0")}-01T08:30:00Z`),
        timeOut: new Date(`2024-${String(lastMonth).padStart(2, "0")}-01T17:30:00Z`),
        report_id: timeKeepingReports[0].id,
      },
    }),
    prisma.timeKeepingReportDetail.create({
      data: {
        employee_id: employees[0].id,
        timeIn: new Date(`2024-${String(currentMonth).padStart(2, "0")}-01T08:00:00Z`),
        timeOut: new Date(`2024-${String(currentMonth).padStart(2, "0")}-01T17:00:00Z`),
        report_id: timeKeepingReports[1].id,
      },
    }),
  ]);
  console.log(`✅ Created ${timeKeepingDetails.length} time keeping report details`);

  // 20. Create Projects
  console.log("🚀 Creating projects...");
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: "Employee Management System",
        description: "Development of comprehensive employee management system",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2025-06-30"),
        status: "IN_PROGRESS",
        budget: 500000000,
        managerId: employees[0].id, // IT Manager
      },
    }),
    prisma.project.create({
      data: {
        name: "HR Digital Transformation",
        description: "Digital transformation of HR processes",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2025-03-31"),
        status: "IN_PROGRESS",
        budget: 300000000,
        managerId: employees[3].id, // HR Manager
      },
    }),
    prisma.project.create({
      data: {
        name: "Marketing Campaign 2024",
        description: "Annual marketing campaign",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-12-31"),
        status: "COMPLETED",
        budget: 200000000,
        managerId: employees[8].id, // Operations Manager
      },
    }),
  ]);
  console.log(`✅ Created ${projects.length} projects`);

  // 21. Create Project Members
  console.log("👥 Creating project members...");
  const projectMembers = await Promise.all([
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        employeeId: employees[1].id,
        role: "Developer",
        joinedAt: new Date("2024-01-01"),
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        employeeId: employees[2].id,
        role: "Tech Lead",
        joinedAt: new Date("2024-01-01"),
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[1].id,
        employeeId: employees[4].id,
        role: "HR Specialist",
        joinedAt: new Date("2024-03-01"),
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[2].id,
        employeeId: employees[7].id,
        role: "Marketing Specialist",
        joinedAt: new Date("2024-06-01"),
      },
    }),
  ]);
  console.log(`✅ Created ${projectMembers.length} project members`);

  // 22. Create Notifications
  console.log("🔔 Creating notifications...");
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: "New Project Assigned",
        content: "You have been assigned to the Employee Management System project",
        createdBy: employees[0].id,
        publishedAt: new Date(),
        isActive: true,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Performance Review Available",
        content: "Your performance review for last month is now available",
        createdBy: employees[2].id,
        publishedAt: new Date(),
        isActive: true,
      },
    }),
    prisma.notification.create({
      data: {
        title: "Company Meeting",
        content: "All-hands meeting scheduled for next week",
        createdBy: employees[3].id,
        publishedAt: new Date(),
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Created ${notifications.length} notifications`);

  // 23. Create Notification Recipients
  console.log("📧 Creating notification recipients...");
  const notificationRecipients = await Promise.all([
    // Notification 1 to multiple employees
    prisma.notificationRecipient.create({
      data: {
        notificationId: notifications[0].id,
        employeeId: employees[1].id,
        isRead: false,
      },
    }),
    prisma.notificationRecipient.create({
      data: {
        notificationId: notifications[0].id,
        employeeId: employees[2].id,
        isRead: true,
        readAt: new Date(),
      },
    }),
    // Notification 2 to employee 0
    prisma.notificationRecipient.create({
      data: {
        notificationId: notifications[1].id,
        employeeId: employees[0].id,
        isRead: false,
      },
    }),
    // Notification 3 to all employees
    ...employees.slice(0, 5).map((employee) =>
      prisma.notificationRecipient.create({
        data: {
          notificationId: notifications[2].id,
          employeeId: employee.id,
          isRead: Math.random() > 0.5,
          readAt: Math.random() > 0.5 ? new Date() : null,
        },
      })
    ),
  ]);
  console.log(`✅ Created ${notificationRecipients.length} notification recipients`);

  console.log("\n✨ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - ${departments.length} Departments`);
  console.log(`   - ${positions.length} Positions`);
  console.log(`   - ${employees.length} Employees`);
  console.log(`   - ${leaveTypes.length} Leave Types`);
  console.log(`   - ${contracts.length} Contracts`);
  console.log(`   - ${workHistories.length} Work Histories`);
  console.log(`   - ${leaveApplications.length} Leave Applications`);
  console.log(`   - ${updateRequests.length} Update Requests`);
  console.log(`   - ${performanceCriterias.length} Performance Criteria`);
  console.log(`   - ${attendanceReports.length} Attendance Reports`);
  console.log(`   - ${attendanceReportDetails.length} Attendance Report Details`);
  console.log(`   - ${performanceReports.length} Performance Reports`);
  console.log(`   - ${performanceReportDetails.length} Performance Report Details`);
  console.log(`   - ${performanceScores.length} Performance Scores`);
  console.log(`   - ${payrollReports.length} Payroll Reports`);
  console.log(`   - ${payrollReportDetails.length} Payroll Report Details`);
  console.log(`   - ${overtimes.length} Overtime Records`);
  console.log(`   - ${timeKeepingReports.length} Time Keeping Reports`);
  console.log(`   - ${timeKeepingDetails.length} Time Keeping Report Details`);
  console.log(`   - ${projects.length} Projects`);
  console.log(`   - ${projectMembers.length} Project Members`);
  console.log(`   - ${notifications.length} Notifications`);
  console.log(`   - ${notificationRecipients.length} Notification Recipients`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

