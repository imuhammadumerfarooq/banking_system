'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'

const formSchema = z.object({
    email: z.string().email(),
})

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    

    const formSchema = authFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            if (type === 'sign-up') {
                const newUser = await signUp(data);
                setUser(newUser);
            }

            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                })
                if (response) router.push('/')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="auth-form">
            <header className="fle flex-col gap-5 md:gap-8">
                {/* Logo & Heading */}
                <Link href='/' className='mb-6 cursor-pointer flex items-center gap-1'>
                    <Image
                        src='/icons/logo.svg'
                        alt='Horizon logo'
                        width={34}
                        height={34}
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
                </Link>

                {/* Heading */}
                <div className="fle flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-30 font-semibold text-gray-900">
                        {user
                            ? 'Link Account'
                            : type === 'sign-in'
                                ? 'Sign In'
                                : 'Sign Up'
                        }
                        <p className="text-16 font-normal text-gray-900">
                            {user
                                ? 'Link your account to get started'
                                : 'Please enter your details'
                            }
                        </p>
                    </h1>
                </div>
             </header>

            {user ? (
                <div className="flex flex-col gap-4">

                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* Additional fields for Sign Up page */}
                            {type === 'sign-up' && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name='firstName'
                                            label='First Name'
                                            placeholder='First Name'
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name='lastName'
                                            label='Last Name'
                                            placeholder='Last Name'
                                        />
                                    </div>
                                    <CustomInput
                                        control={form.control}
                                        name='address'
                                        label='Address'
                                        placeholder='Enter your specific address'
                                    />
                                    <CustomInput
                                        control={form.control}
                                        name='city'
                                        label='City'
                                        placeholder=''
                                    />
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name='state'
                                            label='State'
                                            placeholder='Example: NY'
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name='postalCode'
                                            label='Postal Code'
                                            placeholder='Example: 11101'
                                        />
                                    </div>
                                    <div className="flex gap4">
                                        <CustomInput
                                            control={form.control}
                                            name='dateOfBirth'
                                            label='Date of Birth'
                                            placeholder='yyyy-mm-dd'
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name='ssn'
                                            label='SSN'
                                            placeholder='Example: 1234'
                                        />
                                    </div>
                                </>
                            )}

                            {/* Fields for both Sign In and Sign Up page */}
                            <CustomInput
                                control={form.control}
                                name='email'
                                label='Email'
                                placeholder='Enter your email'
                            />
                            <CustomInput
                                control={form.control}
                                name='password'
                                label='Password'
                                placeholder='Enter your password'
                            />

                            {/* Submit button */}
                            <Button type="submit" disabled={isLoading} className='form-btn'>
                                {isLoading ? (
                                    <>
                                        <Loader2
                                            size={20}
                                            className='animate-spin'
                                        /> &nbsp; Loading...
                                    </>
                                ) : (
                                    type === 'sign-in' ? 'Sign In' : 'Sign Up'
                                )
                                }
                            </Button>
                        </form>
                    </Form>

                    {/* Link to switching to Sign Up or Sign In page  */}
                    <footer className="flex justify-center gap1">
                        <p className='text-14 font-normal text-gray-600'>
                            {type === 'sign-in'
                                ? "Don't have an account?"
                                : "Already have an account?"
                            }
                            <span style={{ marginRight: '4px' }}></span>
                        </p>
                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                            {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    )
}

export default AuthForm