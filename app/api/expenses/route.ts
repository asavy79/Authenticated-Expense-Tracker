// pages/api/expenses.js
import { addExpense, getExpenses, deleteExpense, updateExpense } from "@/actions/expenseActions";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  const expense = await request.json();
  const result = await addExpense(expense);

  if(result.error) {
    return NextResponse.json({error: result.error}, {status: 500})
  }

  return NextResponse.json(result, {status: 200});

}

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  const expenseId = data.expenseId;

  const result = await deleteExpense(expenseId);

  if(result.error) {
    return NextResponse.json({error: result.error}, {status: 500});
  }

  return NextResponse.json(result, {status: 200});

}

export async function GET() {
  const result = await getExpenses();

  if(result.error) {
    return NextResponse.json({error: result.error}, {status: 500});
  }

  return NextResponse.json(result, {status: 200});

}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const result = await updateExpense(data);

  if(result.error) {
    return NextResponse.json({error: result.error}, {status: 500});
  }

  return NextResponse.json(result, {status: 200});
}

/*
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const result = await getExpenses();
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    return res.status(200).json(result.data);
  }

  if (req.method === "POST") {
    const expense = req.body;
    const result = await addExpense(expense);
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    return res.status(200).json(result.data);
  }

  return res.status(405).json({ error: "Method not allowed" });
};

*/

