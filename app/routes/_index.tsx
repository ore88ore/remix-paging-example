import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { Pagination, Table } from "flowbite-react";
import { PrismaClient } from "@prisma/client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const pageNumber = parseInt(url.searchParams.get("page") ?? "1");
  const pageSize = 10;

  const { totalCount, items } = await fetchPagedItems(pageNumber, pageSize);
  const totalPages = Math.ceil(totalCount / pageSize);

  return json({ totalPages, pageNumber, items });
};

export default function Index() {
  const { totalPages, pageNumber, items } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onPageChange = (page: number) => {
    searchParams.set("page", String(page));
    navigate(`/?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-left">アイテム一覧</h1>
        <div className="overflow-x-auto">
          <Table striped={true}>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>タイトル</Table.HeadCell>
              <Table.HeadCell>説明</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {items.map((item) => (
                <Table.Row key={item.id} className="bg-white">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                    {item.id}
                  </Table.Cell>
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pageNumber}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}

// Prisma でページングデータを取得する処理
const fetchPagedItems = async (pageNumber: number, pageSize: number) => {
  const prisma = new PrismaClient();
  const totalCount = await prisma.item.count();
  const items = await prisma.item.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    orderBy: {
      id: "asc",
    },
  });

  return { totalCount, items };
};
