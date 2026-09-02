import type { UseQueryResult } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { AxiosError, AxiosHeaders } from "axios";

import { DataTable } from "@/components/dashboard/data-table";
import { Pager } from "@/components/dashboard/pager";
import { QueryState } from "@/components/dashboard/query-state";

describe("Pager", () => {
  it("renders nothing when everything fits on one page", () => {
    const { container } = render(
      <Pager skip={0} limit={20} pageSize={5} onChange={jest.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("offers a next page only when the current page is full", () => {
    render(<Pager skip={0} limit={20} pageSize={20} onChange={jest.fn()} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).toBeEnabled();
    expect(screen.getByText("Showing 1–20")).toBeInTheDocument();
  });

  it("steps by the page limit and never below zero", () => {
    const onChange = jest.fn();
    render(<Pager skip={20} limit={20} pageSize={7} onChange={onChange} />);
    expect(screen.getByText("Showing 21–27")).toBeInTheDocument();
    expect(screen.getByLabelText("Next page")).toBeDisabled();

    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onChange).toHaveBeenCalledWith(0);
  });
});

describe("DataTable", () => {
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row: { name: string }) => row.name,
    },
  ];

  it("shows the empty message instead of a table", () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        rowKey={(row) => row.name}
        emptyMessage="Nothing yet."
      />,
    );
    expect(screen.getByText("Nothing yet.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("hides rows and the empty message while loading", () => {
    render(
      <DataTable
        columns={columns}
        rows={[{ name: "Ada" }]}
        rowKey={(row) => row.name}
        emptyMessage="Nothing yet."
        isLoading
      />,
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByText("Nothing yet.")).not.toBeInTheDocument();
  });

  it("renders a header and one row per item", () => {
    render(
      <DataTable
        columns={columns}
        rows={[{ name: "Ada" }, { name: "Grace" }]}
        rowKey={(row) => row.name}
        emptyMessage="Nothing yet."
      />,
    );
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeVisible();
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByText("Grace")).toBeInTheDocument();
  });
});

describe("QueryState", () => {
  const asQuery = <T,>(partial: Partial<UseQueryResult<T>>) =>
    ({ refetch: jest.fn(), ...partial }) as unknown as UseQueryResult<T>;

  it("renders the data once the query settles", () => {
    render(
      <QueryState
        query={asQuery<string>({
          isPending: false,
          isError: false,
          data: "ok",
        })}
        fallback="Failed."
      >
        {(data) => <p>loaded {data}</p>}
      </QueryState>,
    );
    expect(screen.getByText("loaded ok")).toBeInTheDocument();
  });

  it("prefers the API's own reason over the fallback and retries on demand", () => {
    const refetch = jest.fn();
    const error = new AxiosError(
      "Request failed",
      "403",
      undefined,
      undefined,
      {
        status: 403,
        statusText: "Forbidden",
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { detail: "Only admins can view the audit log." },
      },
    );
    render(
      <QueryState
        query={asQuery<string>({
          isPending: false,
          isError: true,
          error,
          refetch,
        })}
        fallback="Failed."
      >
        {() => null}
      </QueryState>,
    );
    expect(
      screen.getByText("Only admins can view the audit log."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("falls back to the given message when the error carries no detail", () => {
    render(
      <QueryState
        query={asQuery<string>({
          isPending: false,
          isError: true,
          error: new Error(""),
        })}
        fallback="Could not load the log."
      >
        {() => null}
      </QueryState>,
    );
    expect(screen.getByText("Could not load the log.")).toBeInTheDocument();
  });
});
