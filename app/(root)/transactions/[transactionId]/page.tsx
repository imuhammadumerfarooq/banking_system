"use client";

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import HeaderBox from '@/components/shared/HeaderBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils';
import { transactionCategoryStyles } from '@/constants';

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
    const {
        borderColor,
        backgroundColor,
        textColor,
        chipBackgroundColor,
    } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default

    return (
        <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
            <div className={cn('size-2 rounded-full', backgroundColor)} />
            <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
        </div>
    )
}

const TransactionDetails = () => {
    const { transactionId } = useParams(); // Get the transaction ID from the URL
    const [transaction, setTransaction] = useState<Transaction>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            try {
                const loggedIn = await getLoggedInUser();
                const accounts = await getAccounts({ userId: loggedIn.$id });

                if (!accounts) return;

                const accountsData = accounts?.data;
                const appwriteItemId = accountsData[0]?.appwriteItemId;
                const account = await getAccount({ appwriteItemId });

                // Find the specific transaction using the transactionId
                const foundTransaction: Transaction = account?.transactions.find((t: Transaction) => t.id === transactionId);

                if (foundTransaction) {
                    console.log(foundTransaction);

                    setTransaction(foundTransaction);
                }
            } catch (error) {
                console.error("Failed to fetch transaction details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionDetails();
    }, [transactionId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!transaction) {
        return <p>Transaction not found.</p>;
    }

    // Safely access transaction properties
    const status = getTransactionStatus(new Date(transaction.date));
    const amount = formatAmount(transaction.amount);
    const isDebit = transaction.type === 'debit';

    return (
        <section className=''>
            <div className="transactions-header">
                <HeaderBox
                    title="Transaction Details"
                    subtext="Detailed information about your transaction."
                />
            </div>

            <div className='flex justify-between '>
                <div className="transaction-details border border-gray-100">
                    <p><strong>Transaction Title:</strong> {removeSpecialCharacters(transaction.name)}</p>
                    <p><strong>Amount: {isDebit ? `-${amount}` : amount}</strong></p>
                    <p><strong>Channel:</strong> {transaction.paymentChannel}</p>
                    <p><strong>Date:</strong> {formatDateTime(new Date(transaction.date)).dateTime}</p>
                    <div className="flex">
                    <p className='p-2'><strong>Category:</strong><CategoryBadge category={transaction.category} /></p>
                    <p className='p-2'><strong>Status:</strong><CategoryBadge category={status} /></p>
                    <p className='p-2'><strong>Type:</strong><CategoryBadge category={transaction.type} /></p>
                    </div>
                    <p><strong>Document Id:</strong> {transaction.id}</p>
                    <p><strong>Sender Id:</strong> {transaction.senderBankId}</p>
                    <p><strong>Receiver Id:</strong> {transaction.receiverBankId}</p>
                    <p><strong>Account Id:</strong> {transaction.accountId}</p>
                    <p><strong>Created At:</strong> {transaction.$createdAt}</p>
                    <p><strong>Image:</strong><img src={transaction.image} alt='img' /></p>
                </div>
            </div>
        </section>
    );
};

export default TransactionDetails;
