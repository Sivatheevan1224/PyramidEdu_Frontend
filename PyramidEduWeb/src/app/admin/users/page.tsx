import { MockCrudTable } from "@/components/MockCrudTable";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

const rows = [
  { name: "Dr. Faisal Malik", email: "admin@pyramidedu.com", role: "Admin", status: "Active" },
  { name: "Ms. Priya Sharma", email: "priya@pyramidedu.com", role: "Manager", status: "Active" },
  { name: "Mr. James Okonkwo", email: "james@pyramidedu.com", role: "Teacher", status: "Pending" },
];

export default function UsersPage() {
  return (
    <MockCrudTable
      title="User Management"
      description="Manage platform users across institutes."
      columns={columns}
      initialRows={rows}
    />
  );
}
