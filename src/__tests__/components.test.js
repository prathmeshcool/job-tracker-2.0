import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobForm from "../components/JobForm";
import SearchFilter from "../components/SearchFilter";
import Dashboard from "../components/Dashboard";

// Mock recharts (not needed for unit tests)
jest.mock("recharts", () => ({
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

describe("JobForm", () => {
  it("renders the Add Application button", () => {
    render(<JobForm onAdd={jest.fn()} loading={false} />);
    expect(screen.getByText(/add application/i)).toBeInTheDocument();
  });

  it("opens the form when button is clicked", async () => {
    render(<JobForm onAdd={jest.fn()} loading={false} />);
    await userEvent.click(screen.getByText(/add application/i));
    expect(screen.getByPlaceholderText(/e.g. Google/i)).toBeInTheDocument();
  });

  it("shows error when submitted empty", async () => {
    render(<JobForm onAdd={jest.fn()} loading={false} />);
    await userEvent.click(screen.getByText(/add application/i));
    await userEvent.click(screen.getByText(/save application/i));
    expect(screen.getByText(/company and role are required/i)).toBeInTheDocument();
  });
});

describe("SearchFilter", () => {
  it("renders search input", () => {
    render(<SearchFilter search="" onSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText(/search by company/i)).toBeInTheDocument();
  });

  it("calls onSearch when typing", async () => {
    const mockSearch = jest.fn();
    render(<SearchFilter search="" onSearch={mockSearch} />);
    await userEvent.type(screen.getByPlaceholderText(/search by company/i), "Google");
    expect(mockSearch).toHaveBeenCalled();
  });

  it("shows clear button when search has value", () => {
    render(<SearchFilter search="Google" onSearch={jest.fn()} />);
    expect(screen.getByText("×")).toBeInTheDocument();
  });
});

describe("Dashboard", () => {
  const mockStats = {
    total: 10, Applied: 5, OA: 2, Interview: 2, Offer: 1, Rejected: 0,
  };

  it("renders total count", () => {
    render(<Dashboard stats={mockStats} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("shows interview rate", () => {
    render(<Dashboard stats={mockStats} />);
    expect(screen.getByText(/30% interview rate/i)).toBeInTheDocument();
  });

  it("renders null when no stats", () => {
    const { container } = render(<Dashboard stats={null} />);
    expect(container.firstChild).toBeNull();
  });
});
