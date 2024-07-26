"use server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ExpenseSubmitType } from "@/app/(protected)/expenses/page";

type User = {
        id: string,
        name: string | null,
        email: string,
        emailVerified: Date | null,
        image: string | null,
        password: string | null,
        companyId: number | null,
}


export type ExpenseType = {
    id: number,
    name: string,
    category: string,
    date: Date,
    value: number,
    type: string,
    createdAt: Date,
    updatedAt: Date,
    userId: string,
    user: User,
}

export const addExpense = async (expense: ExpenseSubmitType) => {

    const session = await auth();


    if(!session?.user?.id) return {error: "No session"};


    const { name, category, date, value, type } = expense;

    const company = await db.user.findUnique({where: {id: session.user.id}, select: {Company: true}});

    

    try {
        if(company) {
            const transactionData = await db.expense.create({data: {name, category, date, value, type, userId: session.user.id, companyId: company?.Company?.id}})
            return {data: transactionData};
        }
        const transactionData = await db.expense.create({data: {name, category, date, value, type, userId: session.user.id}})
        return {data: transactionData}
    } catch(error) {
        console.log(error);
        return {error: "Transaction not added"};
    } 
}

export const deleteAnExpense = async (expenseId: number) => {
    try {
        const data = await db.expense.delete({where: {id: expenseId}});
        return {data}
    } catch(error) {
        console.log(error);
        return {error: "Expense could not be deleted"};
    }
}

export const getExpenses = async () => {
    const session = await auth();


    if(!session?.user) return {error: "User not authenticated"};

    const company = await db.user.findUnique({where: {id: session.user.id}, select: {Company: true}});

    try {
        if(company) {
            const data = await db.expense.findMany({where: {companyId: company?.Company?.id}, include: {user: true}})
            return {data}
        }
        const data = await db.expense.findMany({where: {userId: session.user.id}, include: {user: true}})
        
        return {data}
    } catch(error) {
        console.log(error);
        return {error: "Expenses could not be fetched"}
    }
}

export const updateExpense = async (updatedExpense: ExpenseType) => {
    try {
        const data = await db.expense.update({
            where: {
                id: updatedExpense.id,
            },
            data: {
                name: updatedExpense.name,
                category: updatedExpense.category,
                value: updatedExpense.value,
                date: updatedExpense.date,
            }
        })
        return {data};
    } catch(error) {
        console.log(error);
        return {error: "Expense could not be updated"};
    }
}