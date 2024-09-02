// import Image from 'next/image'
// import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
    const categories: CategoryCount[] = countTransactionCategories(transactions);
    return (
        <aside className="right-sidebar">
            <section className="flex flex-col pb-2">
                <div className="profile-banner" />
                <div className="profile">
                    <div className="profile-img">
                        <span className="text-5xl font-bold text-blue-500">{user ? user.firstName[0] : "U"}</span>
                    </div>
                    <div className="profile-details">
                        <h1 className="profile-name">
                            {`${user.firstName} ${user.lastName}`}
                        </h1>
                        <p className="profile-email">
                            {user.email ?? 'No Email Provided'}
                        </p>
                    </div>
                </div>
            </section>

            <section className="banks">
                <div className="flex justify-between w-full">
                    <h2 className="header-2">My Banks</h2>
                    {/* <Link href='/' className="flex gap-2">
                        <Image
                            src='/icons/plus.svg'
                            alt='plus'
                            width={15}
                            height={15}
                            style={{ width: 'auto', height: 'auto' }}
                        />
                        <h2 className="text-14 font-semibold text-gray-600 w-20">
                            Add Bank
                        </h2>
                    </Link> */}
                </div>

                {banks?.length > 0 && (
                    <div className="relative flex flex-1 flex-col items-center justify-center">
                        <div className="relative z-10">
                            <BankCard
                                key={banks[0].$id}
                                account={banks[0]}
                                userName={`${user.firstName} ${user.lastName}`}
                                showBalance={false}
                            />
                        </div>
                        {banks[1] && (
                            <div className="absolute right-0 top-8 z-0 w-[90%]">
                                <BankCard
                                    key={banks[1].$id}
                                    account={banks[1]}
                                    userName={`${user.firstName} ${user.lastName}`}
                                    showBalance={false}
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col flex-1 mt-10 pt-4">
                    <h2 className="header-2">
                        Top Categories
                    </h2>

                    <div className="space-y-2">
                        {categories.map((category, index) => (
                            <Category key={category.name} category={category} />
                        ))}
                    </div>
                </div>
            </section>
        </aside>
    )
}

export default RightSidebar